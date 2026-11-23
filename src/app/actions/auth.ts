'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/db';
import { professionals, students, user } from '@/db/schema';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { registerStudentSchema } from '@/schemas/student';
import { completeRegistrationSchema, type RegistrationRole } from '@/schemas/registration';
import {
    getErrorCode,
    getViolatedConstraint,
    isUniqueViolation,
} from '@/lib/db-errors';

export type FieldErrors = Record<string, string[] | undefined>;

export type RegisterStudentResult =
    | { success: true }
    | { success: false; error?: string; errors?: FieldErrors };

const CPF_TAKEN: FieldErrors = { cpf: ['This CPF is already registered.'] };
const EMAIL_TAKEN: FieldErrors = { email: ['An account with this email already exists.'] };

function isDuplicateEmailError(error: unknown) {
    if (!(error instanceof Error)) return false;
    return /already exists|user_already_exists/i.test(error.message);
}

/**
 * Removes a Better Auth user created before the student profile insert failed.
 * The `account` and `session` rows are deleted by the foreign keys' cascade.
 */
async function removeIncompleteUser(userId: string | null): Promise<boolean> {
    if (!userId) return true;

    try {
        await getDb().delete(user).where(eq(user.id, userId));
        return true;
    } catch (cleanupError) {
        console.error(
            'Failed to roll back incomplete registration:',
            getErrorCode(cleanupError) ?? 'unknown error',
        );
        return false;
    }
}

export type CompleteRegistrationResult =
    | { success: true; role: RegistrationRole }
    | { success: false; error?: string; errors?: FieldErrors };

export async function completeRegistrationAction(
    formData: FormData,
): Promise<CompleteRegistrationResult> {
    const parsed = completeRegistrationSchema.safeParse({
        role: formData.get('role'),
        cpf: formData.get('cpf') ?? '',
        phone: formData.get('phone') ?? '',
        cref: formData.get('cref') ?? '',
        specialty: formData.get('specialty') ?? '',
    });

    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    let session;
    try {
        session = await auth.api.getSession({ headers: await headers() });
    } catch {
        return {
            success: false,
            error: 'We could not verify your session. Please sign in again.',
        };
    }

    if (!session?.user?.id) {
        return { success: false, error: 'You must be signed in to continue.' };
    }

    const userId = session.user.id;
    const data = parsed.data;
    const db = getDb();

    try {
        const [account] = await db
            .select({ role: user.role })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (!account) {
            return { success: false, error: 'Your account could not be found.' };
        }

        // Public registration must never grant administrator access.
        if (account.role === 'admin') {
            return {
                success: false,
                error: 'Administrator accounts cannot use public registration.',
            };
        }

        const [existingStudent, existingProfessional] = await Promise.all([
            db
                .select({ id: students.id })
                .from(students)
                .where(eq(students.userId, userId))
                .limit(1),
            db
                .select({ id: professionals.id })
                .from(professionals)
                .where(eq(professionals.userId, userId))
                .limit(1),
        ]);

        // Keep the action idempotent: a retry or refresh must not create a second
        // profile or change an already completed role.
        if (existingStudent[0]) return { success: true, role: 'student' };
        if (existingProfessional[0]) return { success: true, role: 'professional' };

        if (data.role === 'student') {
            const [cpfOwner] = await db
                .select({ id: students.id })
                .from(students)
                .where(eq(students.cpf, data.cpf))
                .limit(1);
            if (cpfOwner) return { success: false, errors: CPF_TAKEN };

            await db.transaction(async (tx) => {
                if (account.role !== 'student') {
                    await tx
                        .update(user)
                        .set({ role: 'student', updatedAt: new Date() })
                        .where(eq(user.id, userId));
                }

                await tx.insert(students).values({
                    userId,
                    cpf: data.cpf,
                    phone: data.phone ?? null,
                    status: 'active',
                });
            });

            return { success: true, role: 'student' };
        }

        await db.transaction(async (tx) => {
            await tx
                .update(user)
                .set({ role: 'professional', updatedAt: new Date() })
                .where(eq(user.id, userId));

            await tx.insert(professionals).values({
                userId,
                cref: data.cref,
                specialty: data.specialty,
                approved: false,
            });
        });

        return { success: true, role: 'professional' };
    } catch (error) {
        if (isUniqueViolation(error)) {
            const constraint = getViolatedConstraint(error) ?? '';
            if (constraint.includes('cpf')) {
                return { success: false, errors: CPF_TAKEN };
            }

            return {
                success: false,
                error: 'Your registration was already completed. Please refresh the page.',
            };
        }

        console.error(
            'Failed to complete registration:',
            getErrorCode(error) ?? 'unknown error',
        );

        return {
            success: false,
            error: 'We could not complete your registration. Please try again.',
        };
    }
}

export async function registerStudentAction(
    formData: FormData,
): Promise<RegisterStudentResult> {
    const parsed = registerStudentSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        cpf: formData.get('cpf'),
        phone: formData.get('phone'),
    });

    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const data = parsed.data;
    const db = getDb();

    // Cheap pre-flight checks so users get a field-level error before an auth
    // user is created. The database unique constraints remain the source of
    // truth and are handled below for races.
    const [cpfOwner] = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.cpf, data.cpf))
        .limit(1);
    if (cpfOwner) return { success: false, errors: CPF_TAKEN };

    const [emailOwner] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, data.email))
        .limit(1);
    if (emailOwner) return { success: false, errors: EMAIL_TAKEN };

    let createdUserId: string | null = null;

    try {
        const authResult = await auth.api.signUpEmail({
            body: {
                email: data.email,
                password: data.password,
                name: data.name,
            },
            headers: await headers(),
        });

        if (!authResult?.user) {
            return {
                success: false,
                error: 'Unable to create the account. Please try again.',
            };
        }

        createdUserId = authResult.user.id;

        await db.insert(students).values({
            userId: createdUserId,
            cpf: data.cpf,
            phone: data.phone ?? null,
            status: 'active',
        });

        return { success: true };
    } catch (error) {
        // Keep the failure atomic from the user's perspective: never leave an
        // auth account without the matching student profile.
        const rolledBack = await removeIncompleteUser(createdUserId);

        if (isUniqueViolation(error)) {
            const constraint = getViolatedConstraint(error) ?? '';
            if (constraint.includes('cpf')) return { success: false, errors: CPF_TAKEN };
            if (constraint.includes('email')) return { success: false, errors: EMAIL_TAKEN };
            return {
                success: false,
                error: 'An account with these details already exists.',
            };
        }

        if (isDuplicateEmailError(error)) {
            return { success: false, errors: EMAIL_TAKEN };
        }

        console.error('Registration failed:', getErrorCode(error) ?? 'unknown error');

        return {
            success: false,
            error: rolledBack
                ? 'We could not create your account. Please try again.'
                : 'We could not finish creating your account. Please contact support.',
        };
    }
}

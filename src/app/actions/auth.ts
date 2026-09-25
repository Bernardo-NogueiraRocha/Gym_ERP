'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/db';
import { students } from '@/db/schema';
import { headers } from 'next/headers';

type RegisterStudentInput = {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone?: string;
};

export async function registerStudentAction(
    formData: RegisterStudentInput
) {
    try {
        const authResult = await auth.api.signUpEmail({
            body: {
                email: formData.email,
                password: formData.password,
                name: formData.name,
            },
            headers: await headers(),
        });

        // Better Auth succeeded, so authResult should contain the user.
        if (!authResult.user) {
            return {
                success: false,
                error: 'User creation failed.',
            };
        }

        await getDb().insert(students).values({
            userId: authResult.user.id,
            cpf: formData.cpf,
            phone: formData.phone || null,
            status: 'active',
        });

        return {
            success: true,
            user: authResult.user,
        };

    } catch (error) {
        console.error('Registration error:', error);

        return {
            success: false,
            error:  error instanceof Error ? error.message
                    : 'An unexpected error occurred.',
        };
    }
}
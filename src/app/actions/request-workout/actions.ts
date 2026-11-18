'use server';

import { getDb } from '@/db';
import { students, workoutRequests } from '@/db/schema';
import { getSession } from '@/lib/auth-server';
import { and, eq, isNull, or } from 'drizzle-orm';
import { workoutRequestSchema, type WorkoutRequestInput } from '@/schemas/workout-request';

export type RequestWorkoutResult =
    | { success: true }
    | {
          success: false;
          error: string;
          errors?: Record<string, string[] | undefined>;
      };

export async function requestWorkoutAction(
    input: WorkoutRequestInput,
): Promise<RequestWorkoutResult> {
    // Identity always comes from the server-side session, never from the client.
    const session = await getSession();
    if (!session?.user?.id) {
        return { success: false, error: 'You must be signed in to request a workout.' };
    }

    const parsed = workoutRequestSchema.safeParse(input);
    if (!parsed.success) {
        return {
            success: false,
            error: 'Please review the request fields and try again.',
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const db = getDb();
    const [student] = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.userId, session.user.id))
        .limit(1);

    if (!student) {
        return { success: false, error: 'Only students can request a workout.' };
    }

    const [openRequest] = await db
        .select({ id: workoutRequests.id })
        .from(workoutRequests)
        .where(
            and(
                eq(workoutRequests.studentId, student.id),
                or(eq(workoutRequests.solved, false), isNull(workoutRequests.solved)),
            ),
        )
        .limit(1);

    if (openRequest) {
        return {
            success: false,
            error: 'You already have an open workout request. Wait for a professional to review it.',
        };
    }

    const data = parsed.data;

    try {
        await db.insert(workoutRequests).values({
            studentId: student.id,
            experienceLevel: data.experienceLevel,
            priorities: data.priorities,
            focusedMuscles: data.focusedMuscles,
            hasInjuries: data.hasInjuries,
            injuryDetails: data.hasInjuries ? data.injuryDetails ?? null : null,
        });

        return { success: true };
    } catch {
        console.error('Failed to save workout request.');
        return { success: false, error: 'Failed to save workout request.' };
    }
}

"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { students, workouts, workoutSessions, workoutSessionSets } from "@/db/schema";

const finishWorkoutSchema = z.object({
    workoutId: z.string().uuid(),
    startedAt: z.string().datetime(),
    completedAt: z.string().datetime(),
    sets: z.array(
        z.object({
            exerciseId: z.string().uuid(),
            setNumber: z.number().int().positive(),
            targetReps: z.number().int().nonnegative().nullable(),
            actualReps: z.number().int().nonnegative().nullable(),
            // Drizzle numeric columns map to strings in JS
            actualWeight: z.string().nullable(),
            completed: z.boolean(),
        })
    ),
});

export type FinishWorkoutInput = z.infer<typeof finishWorkoutSchema>;

export async function finishWorkoutAction(rawInput: FinishWorkoutInput) {
    // 1. Validate input shape
    const parsed = finishWorkoutSchema.safeParse(rawInput);
    if (!parsed.success) {
        return { success: false, error: "Invalid workout data." };
    }
    const input = parsed.data;

    // 2. Authenticate & resolve student on the server
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized." };
    }

    const db = getDb();

    const [student] = await db
        .select({ id: students.id })
        .from(students)
        .where(eq(students.userId, session.user.id))
        .limit(1);

    if (!student) {
        return { success: false, error: "Student profile not found." };
    }

    // 3. Verify the workout belongs to this student
    const [workout] = await db
        .select({ id: workouts.id })
        .from(workouts)
        .where(and(eq(workouts.id, input.workoutId), eq(workouts.studentId, student.id)))
        .limit(1);

    if (!workout) {
        return { success: false, error: "Workout not found." };
    }

    // 4. Transactional insert: session + all sets
    try {
        const createdSessionId = await db.transaction(async (tx) => {
            const [createdSession] = await tx
                .insert(workoutSessions)
                .values({
                    studentId: student.id,
                    workoutId: input.workoutId,
                    status: "completed",
                    startedAt: new Date(input.startedAt),
                    completedAt: new Date(input.completedAt),
                })
                .returning({ id: workoutSessions.id });

            if (input.sets.length > 0) {
                await tx.insert(workoutSessionSets).values(
                    input.sets.map((s) => ({
                        sessionId: createdSession.id,
                        exerciseId: s.exerciseId,
                        setNumber: s.setNumber,
                        targetReps: s.targetReps ?? 0,
                        actualReps: s.actualReps,
                        actualWeight: s.actualWeight,
                        completed: s.completed,
                    }))
                );
            }

            return createdSession.id;
        });

        revalidatePath("/");
        return { success: true, sessionId: createdSessionId };
    } catch (error) {
        console.error("Failed to save workout session:", error);
        return { success: false, error: "Database error while saving workout." };
    }
}
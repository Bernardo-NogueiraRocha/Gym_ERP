'use server';

import { getDb } from "@/db";
import { exercises, professionals, students, workoutItems, workouts } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { and, eq, inArray } from "drizzle-orm";

type CreateWorkoutInput = {
    studentId: string;
    title: string;
    startDate: string;
    endDate: string | null;
    items: { exerciseId: string; sets: number; reps: number; restSeconds: number }[];
};

export async function createWorkoutAction(input: CreateWorkoutInput) {
    const session = await getSession();
    if (!session) throw new Error("You must be logged in to register a workout.");

    const db = getDb();
    const [professional] = await db
        .select({ id: professionals.id })
        .from(professionals)
        .where(and(eq(professionals.userId, session.user.id), eq(professionals.approved, true)))
        .limit(1);

    if (!professional) throw new Error("An approved professional account is required.");

    if (!input.studentId || !input.title.trim() || input.title.length > 50) {
        throw new Error("Provide a student and a workout title of up to 50 characters.");
    }

    if (!input.startDate || (input.endDate && input.endDate < input.startDate)) {
        throw new Error("The workout dates are invalid.");
    }
    
    if (input.items.length === 0 || input.items.some((item) =>
        !Number.isInteger(item.sets) || item.sets < 1 ||
        !Number.isInteger(item.reps) || item.reps < 1 ||
        !Number.isInteger(item.restSeconds) || item.restSeconds < 0
    )) {
        throw new Error("Add exercises with valid sets, reps, and rest values.");
    }

    const [student] = await db.select({ id: students.id }).from(students)
        .where(eq(students.id, input.studentId)).limit(1);
    if (!student) throw new Error("The selected student was not found.");

    const exerciseIds = [...new Set(input.items.map((item) => item.exerciseId))];

    const availableExercises = await db.select({ id: exercises.id }).from(exercises)
        .where(inArray(exercises.id, exerciseIds));
    
    if (availableExercises.length !== exerciseIds.length) {
        throw new Error("One or more selected exercises are no longer available.");
    }

    await db.transaction(async (tx) => {
        const [workout] = await tx.insert(workouts).values({
            studentId: input.studentId,
            prescribedByProfessionalId: professional.id,
            title: input.title.trim(),
            startDate: input.startDate,
            endDate: input.endDate,
        }).returning({ id: workouts.id });

        await tx.insert(workoutItems).values(input.items.map((item, position) => ({
            workoutId: workout.id,
            exerciseId: item.exerciseId,
            position,
            sets: item.sets,
            reps: item.reps,
            restSeconds: item.restSeconds,
        })));
    });
}

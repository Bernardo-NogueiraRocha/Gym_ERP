import { getDb } from "@/db";
import { exercises, workoutItems, exerciseMuscles,muscles } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getAllExercises() {
    return await getDb()
        .select({
            id: exercises.id,
            name: exercises.name,
        })
        .from(exercises)
        .orderBy(asc(exercises.name));
}

export async function getExercisesWorkoutItems(workoutId: string) {
    return await getDb()
        .select({
            id: workoutItems.id,
            position: workoutItems.position,
            sets: workoutItems.sets,
            reps: workoutItems.reps,
            restSeconds: workoutItems.restSeconds,
            exerciseId: exercises.id,
            exerciseName: exercises.name,
        })
        .from(workoutItems)
        .innerJoin(exercises, eq(workoutItems.exerciseId, exercises.id))
        .where(eq(workoutItems.workoutId, workoutId))
        .orderBy(asc(workoutItems.position));
}

export async function getWorkoutItemsWithMuscles(workoutId: string) {
    const rows = await getDb()
        .select({
            id: workoutItems.id,
            position: workoutItems.position,
            sets: workoutItems.sets,
            reps: workoutItems.reps,
            restSeconds: workoutItems.restSeconds,
            exerciseId: exercises.id,
            exerciseName: exercises.name,
            muscleName: muscles.name,
            muscleSlug: muscles.slug,
            stimulusStrength: exerciseMuscles.stimulusStrength,
        })
        .from(workoutItems)
        .innerJoin(exercises, eq(workoutItems.exerciseId, exercises.id))
        .leftJoin(exerciseMuscles, eq(exerciseMuscles.exerciseId, exercises.id))
        .leftJoin(muscles, eq(muscles.id, exerciseMuscles.muscleId))
        .where(eq(workoutItems.workoutId, workoutId))
        .orderBy(asc(workoutItems.position));

    // Group duplicated SQL rows back into 1 object per workoutItem
    const grouped = new Map<string, any>();

    for (const row of rows) {
        if (!grouped.has(row.id)) {
            grouped.set(row.id, {
                id: row.id,
                position: row.position,
                sets: row.sets,
                reps: row.reps,
                restSeconds: row.restSeconds,
                exerciseId: row.exerciseId,
                exerciseName: row.exerciseName,
                muscles: [],
            });
        }

        if (row.muscleSlug && row.muscleName) {
            grouped.get(row.id).muscles.push({
                name: row.muscleName,
                slug: row.muscleSlug,
                stimulusStrength: row.stimulusStrength,
            });
        }
    }

    return Array.from(grouped.values());
}
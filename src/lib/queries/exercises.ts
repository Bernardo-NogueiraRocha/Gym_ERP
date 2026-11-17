import { getDb } from "@/db";
import { exercises, workoutItems, exerciseMuscles, muscles } from "@/db/schema";
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

    type WorkoutItemWithMuscles = {
        id: string;
        position: number;
        sets: number;
        reps: number;
        restSeconds: number;
        exerciseId: string;
        exerciseName: string;
        muscles: { name: string; slug: string; stimulusStrength: number }[];
    };

    // A left join returns one row per muscle, so group those rows back into
    // one item per exercise in the workout.
    const grouped = new Map<string, WorkoutItemWithMuscles>();

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

        if (
            row.muscleSlug !== null &&
            row.muscleName !== null &&
            row.stimulusStrength !== null
        ) {
            grouped.get(row.id)!.muscles.push({
                name: row.muscleName,
                slug: row.muscleSlug,
                stimulusStrength: row.stimulusStrength,
            });
        }
    }

    return Array.from(grouped.values());
}

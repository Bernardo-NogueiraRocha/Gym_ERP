import { getDb } from "@/db";
import { workouts, workoutItems, exercises, students } from "@/db/schema";
import { and, gte, lte, eq, or, isNull, asc } from "drizzle-orm";

export async function getStudentData(userId: string) {
    const [userData] = await getDb()
        .select({ studentId: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

    return userData ?? null;
}

export async function getCurrentWorkoutsWithItems(studentId: string) {
    const todayStr = new Date().toISOString().split("T")[0];

    const activeWorkouts = await getDb()
        .select()
        .from(workouts)
        .where(
            and(
                eq(workouts.studentId, studentId),
                lte(workouts.startDate, todayStr),
                or(gte(workouts.endDate, todayStr), isNull(workouts.endDate))
            )
        );

    if (!activeWorkouts.length) return [];

    const workoutIds = activeWorkouts.map((w) => w.id);

    const items = await getDb()
        .select({
            workoutId: workoutItems.workoutId,
            id: workoutItems.id,
            exercise_name: exercises.name,
            reps: workoutItems.reps,
            sets: workoutItems.sets,
            restSeconds: workoutItems.restSeconds,
            targetMuscles: exercises.targetMuscles,
        })
        .from(workoutItems)
        .innerJoin(exercises, eq(exercises.id, workoutItems.exerciseId))
        .where(or(...workoutIds.map((id) => eq(workoutItems.workoutId, id))))
        .orderBy(asc(workoutItems.position));

    return activeWorkouts.map((workout) => ({
        ...workout,
        items: items.filter((item) => item.workoutId === workout.id),
    }));
}
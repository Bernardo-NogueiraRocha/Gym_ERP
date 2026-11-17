import { getDb } from "@/db";
import { workouts, workoutItems, exercises, students, user, exerciseMuscles, muscles, workoutSessions, workoutSessionSets } from "@/db/schema";
import { and, gte, lte, eq, or, isNull, asc } from "drizzle-orm";

export async function getStudentData(userId: string) {
    const [userData] = await getDb()
        .select({ studentId: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

    return userData ?? null;
}

export async function getStudentList() {
    const usersData = await getDb()
        .select({
            name: user.name,
            student_id: students.id
        })
        .from(students)
        .innerJoin(user, eq(students.userId,user.id))
    return usersData ?? null;
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

    const db = getDb();
    const items = await db
        .select({
            workoutId: workoutItems.workoutId,
            id: workoutItems.id,
            exercise_name: exercises.name,
            reps: workoutItems.reps,
            sets: workoutItems.sets,
            restSeconds: workoutItems.restSeconds,
        })
        .from(workoutItems)
        .innerJoin(exercises, eq(exercises.id, workoutItems.exerciseId))
        .where(or(...workoutIds.map((id) => eq(workoutItems.workoutId, id))))
        .orderBy(asc(workoutItems.position));

    const muscleRows = await db.select({
        workoutItemId: workoutItems.id,
        name: muscles.name,
        stimulusStrength: exerciseMuscles.stimulusStrength,
    }).from(workoutItems)
        .innerJoin(exerciseMuscles, eq(exerciseMuscles.exerciseId, workoutItems.exerciseId))
        .innerJoin(muscles, eq(muscles.id, exerciseMuscles.muscleId))
        .where(or(...workoutIds.map((id) => eq(workoutItems.workoutId, id))));

    return activeWorkouts.map((workout) => ({
        ...workout,
        items: items.filter((item) => item.workoutId === workout.id).map((item) => ({
            ...item,
            muscles: muscleRows
                .filter((row) => row.workoutItemId === item.id)
                .map(({ name, stimulusStrength }) => ({ name, stimulusStrength })),
        })),
    }));
}

export async function getWorkoutSessions(studentId: string) {
    const rows = await getDb()
        .select({
            sessionId: workoutSessions.id,
            workoutTitle: workouts.title,
            startedAt: workoutSessions.startedAt,
            completedAt: workoutSessions.completedAt,
            status: workoutSessions.status,
            exerciseName: exercises.name,
            actualReps: workoutSessionSets.actualReps,
            actualWeight: workoutSessionSets.actualWeight,
            setNumber: workoutSessionSets.setNumber,
        })
        .from(workoutSessions)
        .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId))
        .leftJoin(workoutSessionSets, eq(workoutSessionSets.sessionId, workoutSessions.id))
        .leftJoin(exercises, eq(exercises.id, workoutSessionSets.exerciseId))
        .where(eq(workoutSessions.studentId, studentId))
        .orderBy(asc(workoutSessions.startedAt));

    const sessions = new Map<string, {
        id: string; workoutTitle: string; startedAt: Date; completedAt: Date | null; status: string;
        exercises: Map<string, { name: string; sets: { reps: number; weight: number }[] }>;
    }>();

    for (const row of rows) {
        let session = sessions.get(row.sessionId);
        if (!session) {
            session = {
                id: row.sessionId,
                workoutTitle: row.workoutTitle,
                startedAt: row.startedAt,
                completedAt: row.completedAt,
                status: row.status,
                exercises: new Map(),
            };
            sessions.set(row.sessionId, session);
        }
        if (!row.exerciseName) continue;
        let exercise = session.exercises.get(row.exerciseName);
        if (!exercise) {
            exercise = { name: row.exerciseName, sets: [] };
            session.exercises.set(row.exerciseName, exercise);
        }
        exercise.sets.push({ reps: row.actualReps ?? 0, weight: Number(row.actualWeight ?? 0) });
    }

    return [...sessions.values()].reverse().map((session) => ({
        ...session,
        exercises: [...session.exercises.values()],
        totalVolume: [...session.exercises.values()].reduce(
            (total, exercise) => total + exercise.sets.reduce((sum, set) => sum + set.reps * set.weight, 0), 0,
        ),
    }));
}

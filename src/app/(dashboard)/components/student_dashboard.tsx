import { getDb } from "@/db";
import { user, workouts, workoutItems, exercises, students } from '@/db/schema';
import { and, between, eq, sql } from "drizzle-orm";

async function getStudentData(userId: string) {
    const [userData] = await getDb()
        .select({ studentId: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

    return userData ?? null;
}

async function getCurrentWorkout(studentId: string) {
    const todayStr = new Date().toISOString().split('T')[0];

    const [result] = await getDb()
        .select()
        .from(workouts)
        .where(
            and(
                eq(workouts.studentId, studentId),
                between(sql`${todayStr}`, workouts.startDate, workouts.endDate)
            )
        )
        .limit(1);

    return result ?? null;
}

async function getWorkoutItems(workoutId: string) {
    return await getDb()
        .select({
            exercise_name: exercises.name,
            reps: workoutItems.reps,
            sets: workoutItems.sets,
            restSeconds: workoutItems.restSeconds,
            targetMuscles: exercises.targetMuscles
        })
        .from(workoutItems)
        .innerJoin(exercises, eq(exercises.id, workoutItems.exerciseId))
        .where(eq(workoutItems.workoutId, workoutId));
}

export async function StudentDashboard({ userId }: { userId: string }) {
    const studentData = await getStudentData(userId);

    if (!studentData) {
        return <div>No student profile found for this account.</div>;
    }

    const currentWorkout = await getCurrentWorkout(studentData.studentId);

    if (!currentWorkout) {
        return (
            <div>
                <h2>No active workout scheduled.</h2>
                <p>Enjoy your rest day!</p>
            </div>
        );
    }

    const currentWorkoutItems = await getWorkoutItems(currentWorkout.id);

    return (
        <div>
            <h2>Workout title: {currentWorkout.title}</h2>
            <h3>Start date: {currentWorkout.startDate}</h3>
            <h3>End date: {currentWorkout.endDate}</h3>

            {currentWorkoutItems.length === 0 ? (
                <p>No exercises listed in this workout plan.</p>
            ) : (
                currentWorkoutItems.map((item, index) => (
                    <p key={index}>
                        {index + 1}) {item.exercise_name}: {item.sets} sets, {item.reps} repetitions with {item.restSeconds} seconds of rest. Targets: {item.targetMuscles}
                    </p>
                ))
            )}
        </div>
    );
}
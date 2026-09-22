import { getDb } from "@/db";
import { workouts, workoutItems, exercises, students } from '@/db/schema';
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

function WorkoutItemsList({ workoutItems }: { workoutItems: Awaited<ReturnType<typeof getWorkoutItems>> }) {
    if (workoutItems.length === 0) {
        return (
            <div className="rounded-md bg-zinc-900 p-4 text-sm text-zinc-400">
                No workout items were added to this workout.
            </div>
        );
    }

    return (
        <ol className="list-decimal list-inside space-y-1">
            {workoutItems.map((item, index) => (
                <li key={item.exercise_name || index}>    
                    <span className="font-medium">{item.exercise_name}</span>: {item.sets} sets for {item.reps} reps
                </li>
            ))}
        </ol>
    );
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

            <WorkoutItemsList workoutItems={currentWorkoutItems}/>
        </div>
    );
}
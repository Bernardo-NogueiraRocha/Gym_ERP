import Link from "next/link";
import { getDb } from "@/db";
import { workouts, workoutItems, exercises, students } from "@/db/schema";
import { and, gte, lte, eq, or, isNull } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/workout-card"; // Import Client Component

async function getStudentData(userId: string) {
    const [userData] = await getDb()
        .select({ studentId: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

    return userData ?? null;
}

async function getCurrentWorkoutsWithItems(studentId: string) {
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
        .where(or(...workoutIds.map((id) => eq(workoutItems.workoutId, id))));

    return activeWorkouts.map((workout) => ({
        ...workout,
        items: items.filter((item) => item.workoutId === workout.id),
    }));
}

export async function StudentDashboard({ userId }: { userId: string }) {
    const studentData = await getStudentData(userId);

    if (!studentData) {
        return (
            <div className="mx-auto max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <h2 className="text-lg font-semibold text-zinc-100">No Active Membership</h2>
                <p className="mt-1 text-sm text-zinc-400">
                    No student membership found associated with this account.
                </p>
                <Link href="/sign-in" className="mt-6 inline-block">
                    <Button size="lg" className="w-full">
                        Explore Plans
                    </Button>
                </Link>
            </div>
        );
    }

    const currentWorkouts = await getCurrentWorkoutsWithItems(studentData.studentId);

    if (!currentWorkouts.length) {
        return (
            <div className="mx-auto max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
                <div className="mx-auto mb-3 text-3xl">🧘‍♂️</div>
                <h2 className="text-xl font-bold text-zinc-100">No active workout scheduled</h2>
                <p className="mt-1 text-sm text-zinc-400">Enjoy your rest day!</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-4 mt-5">
            <h1 className="text-2xl font-bold text-white mb-2">Current Workouts</h1>
            {currentWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
            ))}
        </div>
    );
}
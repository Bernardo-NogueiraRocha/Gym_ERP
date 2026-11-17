import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentWorkoutsWithItems, getStudentData, getWorkoutSessions } from "@/lib/queries/students";
import { CurrentWorkoutsSection } from "./current-workouts-section";
import { WorkoutCalendarPanel } from "./workout-calendar-panel";
import { WorkoutSessionsSection } from "./workout-sessions-section";

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

    const [currentWorkouts, sessions] = await Promise.all([
        getCurrentWorkoutsWithItems(studentData.studentId),
        getWorkoutSessions(studentData.studentId),
    ]);
    const workoutDates = [...new Set(sessions.map((session) => {
        const date = new Date(session.startedAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }))];

    return (
        <div className="mx-auto mt-5 max-w-5xl space-y-8 px-4">
            <CurrentWorkoutsSection workouts={currentWorkouts} />

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <WorkoutSessionsSection sessions={sessions} />
                <WorkoutCalendarPanel workoutDates={workoutDates} />
            </section>
        </div>
    );
}

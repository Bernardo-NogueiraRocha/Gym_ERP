import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/workout-card";
import {getCurrentWorkoutsWithItems,getStudentData} from '@/lib/queries/students'

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

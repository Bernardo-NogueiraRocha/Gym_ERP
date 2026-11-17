import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/workout-card";
import { getCurrentWorkoutsWithItems } from "@/lib/queries/students";

type CurrentWorkouts = Awaited<ReturnType<typeof getCurrentWorkoutsWithItems>>;

export function CurrentWorkoutsSection({ workouts }: { workouts: CurrentWorkouts }) {
    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">Current Workouts</h1>
            {workouts.length ? workouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
            )) : (
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                    <h2 className="font-semibold text-card-foreground">No active workout scheduled</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Would you like to request a workout?</p>
                    <Link href="/request-workout"><Button className="mt-3">Request Workout</Button></Link>
                </div>
            )}
        </section>
    );
}

import type { getWorkoutSessions } from "@/lib/queries/students";
import { WorkoutSessionCard } from "./workout-session-card";

type WorkoutSessions = Awaited<ReturnType<typeof getWorkoutSessions>>;

export function WorkoutSessionsSection({ sessions }: { sessions: WorkoutSessions }) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Workout Sessions</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your completed training history and volume.</p>
            </div>
            {sessions.length ? sessions.map((session) => (
                <WorkoutSessionCard key={session.id} session={session} />
            )) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                    You have no workout sessions registered
                </div>
            )}
        </div>
    );
}

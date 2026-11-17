import type { getWorkoutSessions } from "@/lib/queries/students";

type WorkoutSession = Awaited<ReturnType<typeof getWorkoutSessions>>[number];

export function WorkoutSessionCard({ session }: { session: WorkoutSession }) {
    return (
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-card-foreground">{session.workoutTitle}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(session.startedAt))}
                    </p>
                </div>
                <p className="rounded-md bg-muted px-3 py-2 text-sm font-semibold text-foreground">
                    Total volume: {session.totalVolume.toLocaleString()} kg·reps
                </p>
            </div>
            {session.exercises.length ? (
                <ul className="mt-4 divide-y divide-border">
                    {session.exercises.map((exercise) => (
                        <li key={exercise.name} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                            <span className="font-medium text-card-foreground">{exercise.name}</span>
                            <span className="text-muted-foreground">
                                {exercise.sets.map((set) => `${set.weight} kg × ${set.reps} reps`).join(" · ")}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : <p className="mt-4 text-sm text-muted-foreground">No exercise sets recorded.</p>}
        </article>
    );
}

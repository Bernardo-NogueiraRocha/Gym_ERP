"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type WorkoutItem = {
    id: string;
    exercise_name: string;
    reps: number | null;
    sets: number | null;
    restSeconds: number | null;
    targetMuscles: string | null;
};

type Workout = {
    id: string;
    title: string;
    startDate: string;
    endDate: string | null;
    items: WorkoutItem[];
};

function formatDateToDDMMYYYY(dateInput: string): string {
    const date = new Date(dateInput);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

export function WorkoutCard({ workout }: { workout: Workout }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700">
            {/* Minimized Header / Clickable Toggle */}
            <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">{workout.title}</h3>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                            Active Routine
                        </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                        {workout.items.length} {workout.items.length === 1 ? "exercise" : "exercises"}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <div>
                        <span className="text-zinc-500">Starts:</span>{" "}
                        <span className="font-medium text-zinc-300">
                            {formatDateToDDMMYYYY(workout.startDate)}
                        </span>
                    </div>
                    <div>
                        <span className="text-zinc-500">Ends:</span>{" "}
                        <span className="font-medium text-zinc-300">
                            {workout.endDate ? formatDateToDDMMYYYY(workout.endDate) : "Ongoing"}
                        </span>
                    </div>
                    <div className="rounded-lg bg-zinc-800/80 p-1.5 text-zinc-300">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-zinc-800/80 space-y-4">
                    <h4 className="text-sm font-semibold text-zinc-300">Exercises</h4>
                    {workout.items.length === 0 ? (
                        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4 text-center text-sm text-zinc-400">
                            No exercises assigned to this workout session yet.
                        </div>
                    ) : (
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {workout.items.map((item, index) => (
                                <li
                                    key={item.id ?? index}
                                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-zinc-100">{item.exercise_name}</h4>
                                        {item.targetMuscles && (
                                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                                                {item.targetMuscles}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center gap-4 text-sm text-zinc-300">
                                        <div>
                                            <span className="font-medium text-white">{item.sets}</span> sets
                                        </div>
                                        <span className="text-zinc-600">•</span>
                                        <div>
                                            <span className="font-medium text-white">{item.reps}</span> reps
                                        </div>
                                        {item.restSeconds ? (
                                            <>
                                                <span className="text-zinc-600">•</span>
                                                <div className="text-xs text-zinc-400">
                                                    {item.restSeconds}s rest
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
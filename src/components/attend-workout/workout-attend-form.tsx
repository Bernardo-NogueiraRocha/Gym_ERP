"use client";

import { useState } from "react";
import { workouts } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import type { WorkoutItems, ExerciseOption } from "@/lib/types";

type Workout = InferSelectModel<typeof workouts>;

interface WorkoutAttendanceFormProps {
    workoutItems: WorkoutItems;
    workoutData: Workout;
    exercises: ExerciseOption[];
}

type ActiveSet = {
    setNumber: number;
    targetReps: number | null;
    actualReps: string;
    actualWeight: string;
    completed: boolean;
};

type ActiveExercise = {
    exerciseId: string;
    exerciseName: string;
    restSeconds: number | null;
    sets: ActiveSet[];
};

function buildInitialExercises(items: WorkoutItems): ActiveExercise[] {
    return items.map((item) => {
        const setCount = item.sets ?? 1;
        return {
            exerciseId: item.exerciseId,
            exerciseName: item.exerciseName,
            restSeconds: item.restSeconds,
            sets: Array.from({ length: setCount }, (_, idx) => ({
                setNumber: idx + 1,
                targetReps: item.reps,
                actualReps: item.reps ? String(item.reps) : "",
                actualWeight: "",
                completed: false,
            })),
        };
    });
}

export function WorkoutAttendanceForm({
    workoutItems,
    workoutData,
    exercises,
}: WorkoutAttendanceFormProps) {
    const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>(() =>
        buildInitialExercises(workoutItems)
    );

    function updateSet(
        exerciseIndex: number,
        setIndex: number,
        patch: Partial<ActiveSet>
    ) {
        setActiveExercises((prev) =>
            prev.map((ex, eIdx) => {
                if (eIdx !== exerciseIndex) return ex;
                return {
                    ...ex,
                    sets: ex.sets.map((s, sIdx) =>
                        sIdx === setIndex ? { ...s, ...patch } : s
                    ),
                };
            })
        );
    }

    return (
        <div className="space-y-6 grid grid-cols-2">
            <div>
                {activeExercises.map((exercise, exIndex) => (
                    <div
                        key={`${exercise.exerciseId}-${exIndex}`}
                        className="rounded-xl border border-background bg-card p-4 space-y-3"
                    >
                        {/* Exercise Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white">
                                {exIndex + 1}. {exercise.exerciseName}
                            </h3>
                            {exercise.restSeconds && (
                                <span className="text-xs text-zinc-400">
                                    Rest: {exercise.restSeconds}s
                                </span>
                            )}
                        </div>

                        {/* Column Labels */}
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-400 px-2">
                            <div className="col-span-2">Set</div>
                            <div className="col-span-4">Weight (kg)</div>
                            <div className="col-span-4">Reps</div>
                            <div className="col-span-2 text-center">Done</div>
                        </div>

                        {/* One Row Per Set */}
                        <div className="space-y-2">
                            {exercise.sets.map((set, setIndex) => (
                                <div
                                    key={set.setNumber}
                                    className={`grid grid-cols-12 items-center gap-2 rounded-lg p-2 transition-colors ${set.completed
                                            ? "bg-emerald-500/10 border border-emerald-500/30"
                                            : "bg-zinc-950/60 border border-zinc-800"
                                        }`}
                                >
                                    <div className="col-span-2 text-sm font-semibold text-zinc-300">
                                        {set.setNumber}
                                    </div>

                                    <div className="col-span-4">
                                        <input
                                            type="number"
                                            step="0.5"
                                            placeholder="0"
                                            value={set.actualWeight}
                                            onChange={(e) =>
                                                updateSet(exIndex, setIndex, {
                                                    actualWeight: e.target.value,
                                                })
                                            }
                                            className="w-full rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-sm text-white"
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <input
                                            type="number"
                                            placeholder={
                                                set.targetReps
                                                    ? String(set.targetReps)
                                                    : "0"
                                            }
                                            value={set.actualReps}
                                            onChange={(e) =>
                                                updateSet(exIndex, setIndex, {
                                                    actualReps: e.target.value,
                                                })
                                            }
                                            className="w-full rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-sm text-white"
                                        />
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <input
                                            type="checkbox"
                                            checked={set.completed}
                                            onChange={(e) =>
                                                updateSet(exIndex, setIndex, {
                                                    completed: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5 accent-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                Stimulus Visualizer
            </div>
        </div>
    );
}
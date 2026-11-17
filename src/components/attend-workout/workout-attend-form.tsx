"use client";

import { useState,useMemo } from "react";
import { workouts } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import type { WorkoutItems, ExerciseOption } from "@/lib/types";
import BodyHighlighter from './body-highlighter'
import type { ExtendedBodyPart, Slug } from "@mjcdev/react-body-highlighter";

type Workout = InferSelectModel<typeof workouts>;

type MuscleStimulus = {
    slug: string;
    stimulusStrength: number;
};

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
    muscles: MuscleStimulus[];
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
            muscles: item.muscles
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

    const highlightedMuscles = useMemo<ExtendedBodyPart[]>(() => {
        const totals = new Map<string, number>();

        // Sum stimulusStrength for every COMPLETED set
        for (const exercise of activeExercises) {
            const completedSetsCount = exercise.sets.filter((s) => s.completed).length;
            if (completedSetsCount === 0) continue;

            for (const muscle of exercise.muscles) {
                const addedStimulus = muscle.stimulusStrength * completedSetsCount;
                totals.set(muscle.slug, (totals.get(muscle.slug) ?? 0) + addedStimulus);
            }
        }

        if (totals.size === 0) return [];

        // Bucket totals into intensity 1, 2, or 3 relative to the highest-worked muscle
        const maxStimulus = Math.max(...totals.values());

        return Array.from(totals.entries()).map(([slug, total]) => {
            const ratio = total / maxStimulus;
            let intensity = 1;
            if (ratio > 0.66) intensity = 3;
            else if (ratio > 0.33) intensity = 2;

            return {
                slug: slug as Slug,
                intensity,
            };
        });
    }, [activeExercises]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                {activeExercises.map((exercise, exIndex) => (
                    <div
                        key={`${exercise.exerciseId}-${exIndex}`}
                        className="space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm"
                    >
                        {/* Exercise Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-card-foreground">
                                {exIndex + 1}. {exercise.exerciseName}
                            </h3>
                            {exercise.restSeconds && (
                                <span className="text-xs text-muted-foreground">
                                    Rest: {exercise.restSeconds}s
                                </span>
                            )}
                        </div>

                        {/* Column Labels */}
                        <div className="grid grid-cols-12 gap-2 px-2 text-xs font-medium text-muted-foreground">
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
                                        ? "border border-success/30 bg-success/10"
                                        : "border border-border bg-muted"
                                        }`}
                                >
                                    <div className="col-span-2 text-sm font-semibold text-foreground">
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
                                            className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                            className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                            className="h-5 w-5 cursor-pointer accent-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <section className="h-fit space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                <div>
                    <h2 className="font-semibold">Muscle activation</h2>
                    <p className="text-sm text-muted-foreground">Highlights update as you complete sets.</p>
                </div>
                <BodyHighlighter data={highlightedMuscles} />
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground" aria-label="Muscle activation intensity legend">
                    <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-info" />Light</span>
                    <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-primary" />Moderate</span>
                    <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-accent" />High</span>
                </div>
            </section>
        </div>
    );
}

"use client";

import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import type { InferSelectModel } from "drizzle-orm";
import type { WorkoutItems, ExerciseOption } from "@/lib/types";
import { workouts } from "@/db/schema";
import { finishWorkoutAction } from "@/app/actions/attend-workout/actions";
import { Button } from "@/components/ui/button";
import { ExerciseList } from "@/components/register-workout/exercise-list";
import { MuscleActivationPanel } from "./muscle-activation-panel";
import { WorkoutExerciseCard } from "./workout-exercise-card";
import { WorkoutSessionOverview } from "./workout-session-overview";
import {
    buildInitialExercises,
    createActiveExercise,
    type ActiveExercise,
    type ActiveSet,
} from "./workout-attend.types";
import type { ExtendedBodyPart, Slug } from "@mjcdev/react-body-highlighter";

type Workout = InferSelectModel<typeof workouts>;

interface WorkoutAttendanceFormProps {
    workoutItems: WorkoutItems;
    workoutData: Workout;
    exerciseList: ExerciseOption[];
}

export function WorkoutAttendanceForm({
    workoutItems,
    workoutData,
    exerciseList,
}: WorkoutAttendanceFormProps) {
    const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>(() =>
        buildInitialExercises(workoutItems)
    );
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [workoutDate, setWorkoutDate] = useState<Date | undefined>();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    const plannedExerciseIds = useMemo(
        () => new Set(workoutItems.map((item) => item.exerciseId)),
        [workoutItems]
    );

    useEffect(() => {
        if (isTimerPaused) return;

        const intervalId = window.setInterval(() => {
            setElapsedSeconds((elapsed) => elapsed + 1);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isTimerPaused]);

    const totalSets = useMemo(
        () => activeExercises.reduce((total, exercise) => total + exercise.sets.length, 0),
        [activeExercises]
    );
    const completedSets = useMemo(
        () => activeExercises.reduce(
            (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
            0
        ),
        [activeExercises]
    );

    function updateSet(
        exerciseId: string,
        setNumber: number,
        changes: Partial<ActiveSet>
    ) {
        setActiveExercises((current) => current.map((exercise) => {
            if (exercise.exerciseId !== exerciseId) return exercise;
            return {
                ...exercise,
                sets: exercise.sets.map((set) => set.setNumber === setNumber
                    ? { ...set, ...changes }
                    : set
                ),
            };
        }));
    }

    function toggleExtraExercise(exerciseId: string) {
        if (plannedExerciseIds.has(exerciseId)) return;
        const selectedExercise = exerciseList.find((exercise) => exercise.id === exerciseId);
        if (!selectedExercise) return;

        setActiveExercises((current) => {
            if (current.some((exercise) => exercise.exerciseId === exerciseId)) {
                return current.filter((exercise) => exercise.exerciseId !== exerciseId);
            }
            return [...current, createActiveExercise(selectedExercise)];
        });
    }

    function copySetToRemaining(exerciseId: string, setNumber: number) {
        setActiveExercises((current) => current.map((exercise) => {
            if (exercise.exerciseId !== exerciseId) return exercise;
            const sourceSet = exercise.sets.find((set) => set.setNumber === setNumber);
            if (!sourceSet) return exercise;

            return {
                ...exercise,
                sets: exercise.sets.map((set) => set.setNumber <= setNumber
                    ? set
                    : {
                        ...set,
                        actualWeight: sourceSet.actualWeight,
                        actualReps: sourceSet.actualReps,
                    }
                ),
            };
        }));
    }

    const highlightedMuscles = useMemo<ExtendedBodyPart[]>(() => {
        const totals = new Map<string, number>();

        for (const exercise of activeExercises) {
            const completedCount = exercise.sets.filter((set) => set.completed).length;
            if (completedCount === 0) continue;

            for (const muscle of exercise.muscles) {
                totals.set(
                    muscle.slug,
                    (totals.get(muscle.slug) ?? 0) + muscle.stimulusStrength * completedCount
                );
            }
        }

        if (totals.size === 0) return [];
        const maxStimulus = Math.max(...totals.values());

        return Array.from(totals.entries()).map(([slug, total]) => {
            const ratio = total / maxStimulus;
            const intensity = ratio > 0.66 ? 3 : ratio > 0.33 ? 2 : 1;
            return { slug: slug as Slug, intensity };
        });
    }, [activeExercises]);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formattedSets = [];
        for (const exercise of activeExercises) {
            for (const set of exercise.sets) {
                const repsText = set.actualReps.trim();
                const actualReps = repsText === "" ? null : Number(repsText);
                if (actualReps !== null && (!Number.isInteger(actualReps) || actualReps < 0)) {
                    setError(`Enter a whole, non-negative rep count for ${exercise.exerciseName}, set ${set.setNumber}.`);
                    return;
                }

                const weightText = set.actualWeight.trim();
                const weight = weightText === "" ? null : Number(weightText);
                if (weight !== null && (!Number.isFinite(weight) || weight < 0)) {
                    setError(`Enter a valid, non-negative weight for ${exercise.exerciseName}, set ${set.setNumber}.`);
                    return;
                }

                formattedSets.push({
                    exerciseId: exercise.exerciseId,
                    setNumber: set.setNumber,
                    targetReps: set.targetReps,
                    actualReps,
                    actualWeight: weight === null ? null : weight.toFixed(2),
                    completed: set.completed,
                });
            }
        }

        setIsSubmitting(true);
        const now = new Date();
        const completedAtDate = new Date(workoutDate ?? now);
        completedAtDate.setHours(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
        );
        const startedAtDate = new Date(completedAtDate.getTime() - elapsedSeconds * 1000);

        try {
            const result = await finishWorkoutAction({
                workoutId: workoutData.id,
                startedAt: startedAtDate.toISOString(),
                completedAt: completedAtDate.toISOString(),
                sets: formattedSets,
            });
            if (!result.success) {
                setError(result.error ?? "Failed to save workout session.");
            }
        } catch (submitError) {
            setError(submitError instanceof Error
                ? submitError.message
                : "Failed to finish workout session.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <WorkoutSessionOverview
                workoutDate={workoutDate}
                onWorkoutDateChange={setWorkoutDate}
                elapsedSeconds={elapsedSeconds}
                isTimerPaused={isTimerPaused}
                onTimerPauseToggle={() => setIsTimerPaused((paused) => !paused)}
                onDurationSet={(minutes) => setElapsedSeconds(minutes * 60)}
                completedSets={completedSets}
                totalSets={totalSets}
            />

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
                <div className="space-y-4">
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Exercises</h2>
                            <p className="text-sm text-muted-foreground">
                                Record your work for each planned or added exercise.
                            </p>
                        </div>
                        {activeExercises.length > 0 ? activeExercises.map((exercise, index) => (
                            <WorkoutExerciseCard
                                key={exercise.exerciseId}
                                exercise={exercise}
                                position={index + 1}
                                removable={!plannedExerciseIds.has(exercise.exerciseId)}
                                onRemove={toggleExtraExercise}
                                onSetChange={updateSet}
                                onCopySetToRemaining={copySetToRemaining}
                            />
                        )) : (
                            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                                No exercises are currently in this workout. Add one from the library to get started.
                            </p>
                        )}
                    </section>

                    <section className="space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                        <div>
                            <h2 className="font-semibold">Add an exercise</h2>
                            <p className="text-sm text-muted-foreground">
                                Planned exercises stay in the session; added exercises can be removed.
                            </p>
                        </div>
                        <ExerciseList
                            exerciseList={exerciseList}
                            selectedIds={activeExercises.map((exercise) => exercise.exerciseId)}
                            lockedIds={[...plannedExerciseIds]}
                            onToggle={toggleExtraExercise}
                        />
                    </section>
                </div>

                <div className="space-y-4 xl:sticky xl:top-4">
                    <MuscleActivationPanel muscles={highlightedMuscles} />
                </div>
            </div>

            {error && (
                <p className="text-center text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
            <div className="flex justify-center">
                <Button className="text-lg" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Saving workout…" : "Finish workout"}
                </Button>
            </div>
        </form>
    );
}

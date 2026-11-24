"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActiveExercise, ActiveSet } from "./workout-attend.types";

interface WorkoutExerciseCardProps {
    exercise: ActiveExercise;
    position: number;
    removable?: boolean;
    onRemove?: (exerciseId: string) => void;
    onSetChange: (
        exerciseId: string,
        setNumber: number,
        changes: Partial<ActiveSet>
    ) => void;
    onCopySetToRemaining: (exerciseId: string, setNumber: number) => void;
}

export function WorkoutExerciseCard({
    exercise,
    position,
    removable = false,
    onRemove,
    onSetChange,
    onCopySetToRemaining,
}: WorkoutExerciseCardProps) {
    return (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-card-foreground">
                        {position}. {exercise.exerciseName}
                    </h3>
                    {exercise.restSeconds != null && (
                        <p className="text-xs text-muted-foreground">
                            Rest: {exercise.restSeconds}s
                        </p>
                    )}
                </div>
                {removable && onRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(exercise.exerciseId)}
                        aria-label={`Remove ${exercise.exerciseName} from this session`}
                    >
                        Remove
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-12 gap-2 px-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-2">Set</div>
                <div className="col-span-4">Weight (kg)</div>
                <div className="col-span-4">Reps</div>
                <div className="col-span-2 text-center">Done</div>
            </div>

            <div className="space-y-2">
                {exercise.sets.map((set) => (
                    <div
                        key={set.setNumber}
                        className={`space-y-2 rounded-lg border p-2 transition-colors ${set.completed
                            ? "border-success/30 bg-success/10"
                            : "border-border bg-muted"
                            }`}
                    >
                        <div className="grid grid-cols-12 items-center gap-2">
                            <div className="col-span-2 text-sm font-semibold text-foreground">
                                {set.setNumber}
                            </div>
                            <div className="col-span-4">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    placeholder="0"
                                    value={set.actualWeight}
                                    aria-label={`Set ${set.setNumber} weight in kilograms for ${exercise.exerciseName}`}
                                    onChange={(event) => onSetChange(exercise.exerciseId, set.setNumber, {
                                        actualWeight: event.target.value,
                                    })}
                                    className="px-2 py-1 text-sm"
                                />
                            </div>
                            <div className="col-span-4">
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder={set.targetReps != null ? String(set.targetReps) : "0"}
                                    value={set.actualReps}
                                    aria-label={`Set ${set.setNumber} reps for ${exercise.exerciseName}`}
                                    onChange={(event) => onSetChange(exercise.exerciseId, set.setNumber, {
                                        actualReps: event.target.value,
                                    })}
                                    className="px-2 py-1 text-sm"
                                />
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <input
                                    type="checkbox"
                                    checked={set.completed}
                                    aria-label={`Mark set ${set.setNumber} of ${exercise.exerciseName} complete`}
                                    onChange={(event) => onSetChange(exercise.exerciseId, set.setNumber, {
                                        completed: event.target.checked,
                                    })}
                                    className="h-5 w-5 cursor-pointer accent-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                        {set.completed && set.setNumber < exercise.sets.length && (
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => onCopySetToRemaining(exercise.exerciseId, set.setNumber)}
                            >
                                Apply weight and reps to remaining sets
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

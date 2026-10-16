'use client';

import type { InferSelectModel } from "drizzle-orm";
import { exercises } from "@/db/schema";
import type { WorkoutItemDraft } from "./workout-item-draft";

type Exercise = InferSelectModel<typeof exercises>;

interface SelectedExercisesProps {
    items: WorkoutItemDraft[];
    exercises: Exercise[];
    onUpdate: (exerciseId: string, changes: Partial<Omit<WorkoutItemDraft, "exerciseId">>) => void;
    onRemove: (exerciseId: string) => void;
    onMove: (exerciseId: string, direction: -1 | 1) => void;
}

export function SelectedExercises({
    items,
    exercises,
    onUpdate,
    onRemove,
    onMove,
}: SelectedExercisesProps) {
    const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

    if (items.length === 0) {
        return <p className="text-sm text-slate-400">No exercises selected yet.</p>;
    }

    return (
        <ol className="space-y-3">
            {items.map((item, index) => {
                const exercise = exerciseById.get(item.exerciseId);

                if (!exercise) return null;

                return (
                    <li key={item.exerciseId}>
                        <fieldset className="space-y-3 rounded-lg border border-slate-600 p-4">
                            <legend className="px-2 font-semibold text-slate-100">
                                {index + 1}. {exercise.name}
                            </legend>

                            <p className="text-sm text-slate-400">Target muscles: {exercise.targetMuscles}</p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <label className="space-y-1 text-sm text-slate-200">
                                    <span>Sets</span>
                                    <input
                                        type="number"
                                        min={1}
                                        step={1}
                                        required
                                        value={item.sets}
                                        onChange={(event) => onUpdate(item.exerciseId, { sets: Number(event.target.value) })}
                                        className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                                    />
                                </label>
                                <label className="space-y-1 text-sm text-slate-200">
                                    <span>Reps</span>
                                    <input
                                        type="number"
                                        min={1}
                                        step={1}
                                        required
                                        value={item.reps}
                                        onChange={(event) => onUpdate(item.exerciseId, { reps: Number(event.target.value) })}
                                        className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                                    />
                                </label>
                                <label className="space-y-1 text-sm text-slate-200">
                                    <span>Rest (seconds)</span>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        required
                                        value={item.restSeconds}
                                        onChange={(event) => onUpdate(item.exerciseId, { restSeconds: Number(event.target.value) })}
                                        className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => onMove(item.exerciseId, -1)}
                                    disabled={index === 0}
                                    aria-label={`Move ${exercise.name} up`}
                                    className="rounded-md border border-slate-500 px-3 py-1 text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Move up
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onMove(item.exerciseId, 1)}
                                    disabled={index === items.length - 1}
                                    aria-label={`Move ${exercise.name} down`}
                                    className="rounded-md border border-slate-500 px-3 py-1 text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Move down
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemove(item.exerciseId)}
                                    className="rounded-md border border-red-500/70 px-3 py-1 text-sm text-red-200"
                                >
                                    Remove
                                </button>
                            </div>
                        </fieldset>
                    </li>
                );
            })}
        </ol>
    );
}

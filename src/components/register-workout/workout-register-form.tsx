'use client';

import { useState, type FormEvent } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { exercises } from "@/db/schema";
import { ExerciseList } from "./exercise-list";
import { SelectedExercises } from "./selected-exercises";
import type { WorkoutItemDraft } from "./workout-item-draft";
import { DatePicker } from "./date-picker";
import { Button } from "../ui/button";

type Exercise = InferSelectModel<typeof exercises>;

interface WorkoutRegisterFormProps {
    exercises: Exercise[];
}

export function WorkoutRegisterForm({ exercises }: WorkoutRegisterFormProps) {
    const [items, setItems] = useState<WorkoutItemDraft[]>([]);
    const selectedIds = items.map((item) => item.exerciseId);

    const [startDate, setStartDate] = useState<Date | undefined>(() => new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(() => new Date());

    const toggleExercise = (exerciseId: string) => {
        setItems((current) => {
            if (current.some((item) => item.exerciseId === exerciseId)) {
                return current.filter((item) => item.exerciseId !== exerciseId);
            }

            return [...current, { exerciseId, sets: 3, reps: 10, restSeconds: 30 }];
        });
    };

    const updateExercise = (
        exerciseId: string,
        changes: Partial<Omit<WorkoutItemDraft, "exerciseId">>
    ) => {
        setItems((current) =>
            current.map((item) =>
                item.exerciseId === exerciseId ? { ...item, ...changes } : item
            )
        );
    };

    const removeExercise = (exerciseId: string) => {
        setItems((current) => current.filter((item) => item.exerciseId !== exerciseId));
    };

    const moveExercise = (exerciseId: string, direction: -1 | 1) => {
        setItems((current) => {
            const index = current.findIndex((item) => item.exerciseId === exerciseId);
            const nextIndex = index + direction;

            if (index === -1 || nextIndex < 0 || nextIndex >= current.length) {
                return current;
            }

            const reordered = [...current];
            [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
            return reordered;
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const workoutData = {
            startDate,
            endDate,
            items,
        };

        console.log(workoutData);
    };

    return (
        <div className="px-4 mt-5">
            <h2 className="text-center text-2xl font-semibold text-slate-100">
                Register Workout
            </h2>
            <form
                onSubmit={handleSubmit}
                className="mx-auto mt-2 space-y-4 rounded-2xl border-2 p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 grid-rows2">

                    <section className="space-y-2 max-w-xl">
                        <h3 className="text-lg font-medium text-slate-100">Exercise library</h3>
                        <ExerciseList
                            exerciseList={exercises}
                            selectedIds={selectedIds}
                            onToggle={toggleExercise}
                        />
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-lg font-medium text-slate-100">
                            Selected exercises ({items.length})
                        </h3>
                        <SelectedExercises
                            items={items}
                            exercises={exercises}
                            onUpdate={updateExercise}
                            onRemove={removeExercise}
                            onMove={moveExercise}
                        />
                    </section>

                    <section className="ml-4 space-y-3">
                        <h3 className="text-lg font-medium text-slate-100">Start date</h3>
                        <DatePicker date={startDate} onSelect={setStartDate} />
                    </section>

                    <section className="ml-4 space-y-3">
                        <h3 className="text-lg font-medium text-slate-100">End date</h3>
                        <DatePicker date={endDate} onSelect={setEndDate} />
                    </section>
                </div>

                <div className="flex justify-center pt-2">
                    <Button type="submit" className="text-lg w-50 bg-blue-600">Submit Workout</Button>
                </div>
            </form>
        </div>
    );
}

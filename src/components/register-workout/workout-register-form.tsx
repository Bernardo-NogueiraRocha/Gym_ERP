'use client';

import { useState, type FormEvent } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { exercises } from "@/db/schema";
import { ExerciseList } from "./exercise-list";
import { SelectedExercises } from "./selected-exercises";
import type { WorkoutItemDraft } from "./workout-item-draft";
import { DatePicker } from "./date-picker";
import { Button } from "../ui/button";
import { StudentSelector } from "./student-selector";
import { WorkoutRequestList } from "./workout-request-list";
import type { StudentList } from "@/lib/types";
import type { getWorkoutRequests } from "@/lib/queries/workout-requests";
import { createWorkoutAction } from "@/app/actions/workout-register/actions";
import { format } from "date-fns";

type Exercise = InferSelectModel<typeof exercises>;

interface WorkoutRegisterFormProps {
    exercises: Exercise[];
    students: StudentList;
    workoutRequests: Awaited<ReturnType<typeof getWorkoutRequests>>;
}

export function WorkoutRegisterForm({ exercises, students, workoutRequests }: WorkoutRegisterFormProps) {
    const [items, setItems] = useState<WorkoutItemDraft[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [title, setTitle] = useState("Custom workout");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (!selectedStudentId) {
            setError("Select a student from the list or a workout request.");
            return;
        }
        if (!startDate || (endDate && endDate < startDate)) {
            setError("Choose a valid start date and an end date after it.");
            return;
        }
        if (items.length === 0) {
            setError("Add at least one exercise to the workout.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createWorkoutAction({
                studentId: selectedStudentId,
                title: title.trim(),
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
                items,
            });
            setError(null);
            setItems([]);
            setSelectedStudentId(null);
            setTitle("Custom workout");
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to register workout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 mt-5">
            <h2 className="text-center text-2xl font-semibold text-slate-100">
                Register Workout
            </h2>
            <div className="mx-auto mt-4 grid max-w-6xl grid-cols-1 gap-6 xl:grid-cols-2">
                <WorkoutRequestList
                    workoutRequests={workoutRequests}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                />
                <StudentSelector
                    usersData={students}
                    selectedUserId={selectedStudentId}
                    onSelect={setSelectedStudentId}
                />
            </div>
            <form
                onSubmit={handleSubmit}
                className="mx-auto mt-4 max-w-6xl space-y-4 rounded-2xl border-2 p-6"
            >
                <p className="text-slate-200" aria-live="polite">
                    {selectedStudentId
                        ? `Selected student: ${students.find((student) => student.student_id === selectedStudentId)?.name ?? "Student"}`
                        : "Select a student from the list or choose a workout request above."}
                </p>
                <label className="block space-y-1 text-slate-100">
                    <span>Workout title</span>
                    <input
                        required
                        maxLength={50}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
                    />
                </label>
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
                    <Button type="submit" disabled={isSubmitting} className="text-lg w-50 bg-blue-600">
                        {isSubmitting ? "Saving…" : "Submit Workout"}
                    </Button>
                </div>
                {error && <p role="alert" className="text-center text-red-400">{error}</p>}
            </form>
        </div>
    );
}

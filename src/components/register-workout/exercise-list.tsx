'use client';
import type { InferSelectModel } from "drizzle-orm";
import { exercises } from "@/db/schema";
import { ExerciseSelector } from "./exercise-selector";
import { useState } from "react";

type Exercise = InferSelectModel<typeof exercises>;


export function ExerciseList({ exerciseList }: { exerciseList: Exercise[] }) {
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

    const toggleExercise = (id: string) => {
        setSelectedExerciseIds((prev) =>
            prev.includes(id)
                ? prev.filter((selectedId) => selectedId !== id)
                : [...prev, id]
        );
    };

    if (!exerciseList || exerciseList.length === 0) {
        return (
            <div>
                No exercises found
            </div>
        );
    }

    return (
        <ul className="space-y-2 m-4">
            {exerciseList.map((exercise, index) => (
                <ExerciseSelector
                    key={exercise.id}
                    exercise={exercise}
                    selected={selectedExerciseIds.includes(exercise.id)}
                    onToggle={toggleExercise}
                />
            ))}
        </ul>
    );
}
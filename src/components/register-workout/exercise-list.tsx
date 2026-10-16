'use client';
import type { InferSelectModel } from "drizzle-orm";
import { exercises } from "@/db/schema";
import { ExerciseSelector } from "./exercise-selector";

type Exercise = InferSelectModel<typeof exercises>;

interface ExerciseListProps {
    exerciseList: Exercise[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export function ExerciseList({ exerciseList, selectedIds, onToggle }: ExerciseListProps) {
    if (!exerciseList || exerciseList.length === 0) {
        return (
            <div>
                No exercises found
            </div>
        );
    }
    
    return (
        <ul className="m-4 space-y-2">
            {exerciseList.map((exercise) => (
                <ExerciseSelector
                    key={exercise.id}
                    exercise={exercise}
                    selected={selectedIds.includes(exercise.id)}
                    onToggle={onToggle}
                />
            ))}
        </ul>
    );
}

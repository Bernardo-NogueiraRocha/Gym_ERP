"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { ExerciseOption } from "@/lib/types";
import { ExerciseSelector } from "./exercise-selector";

interface ExerciseListProps {
    exerciseList: ExerciseOption[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    lockedIds?: string[];
}

export function ExerciseList({
    exerciseList,
    selectedIds,
    onToggle,
    lockedIds = [],
}: ExerciseListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const lockedIdSet = useMemo(() => new Set(lockedIds), [lockedIds]);
    const filteredExercises = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
        if (!normalizedSearch) return exerciseList;

        return exerciseList.filter((exercise) =>
            exercise.name.toLocaleLowerCase().includes(normalizedSearch)
        );
    }, [exerciseList, searchTerm]);

    if (exerciseList.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No exercises available.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            <label className="block space-y-1 text-sm text-muted-foreground">
                <span className="sr-only">Search exercises</span>
                <Input
                    type="search"
                    placeholder="Search exercises…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </label>
            {filteredExercises.length > 0 ? (
                <ul className="max-h-96 space-y-2 overflow-y-auto pr-1" aria-label="Exercise library">
                    {filteredExercises.map((exercise) => (
                        <li key={exercise.id}>
                            <ExerciseSelector
                                exercise={exercise}
                                selected={selectedIdSet.has(exercise.id)}
                                locked={lockedIdSet.has(exercise.id)}
                                onToggle={onToggle}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="py-3 text-sm text-muted-foreground" role="status">
                    No exercises match “{searchTerm}”.
                </p>
            )}
        </div>
    );
}

"use client";

import type { ExerciseOption } from "@/lib/types";

type ExerciseSelectorProps = {
    exercise: ExerciseOption;
    selected: boolean;
    locked?: boolean;
    onToggle: (id: string) => void;
};

export function ExerciseSelector({
    exercise,
    selected,
    locked = false,
    onToggle,
}: ExerciseSelectorProps) {
    return (
        <button
            type="button"
            onClick={() => onToggle(exercise.id)}
            aria-pressed={selected}
            disabled={locked}
            className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-75 ${selected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
                }`}
        >
            <span>{exercise.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
                {locked ? "In workout" : selected ? "Added · remove" : "Add"}
            </span>
        </button>
    );
}

'use client';
import type { InferSelectModel } from "drizzle-orm";
import { exercises } from "@/db/schema";

type Exercise = InferSelectModel<typeof exercises>;

type ExerciseSelectorProps = {
    exercise: Exercise;
    selected: boolean;
    onToggle: (id: string) => void;
};

export function ExerciseSelector({
    exercise,
    selected,
    onToggle,
}: ExerciseSelectorProps) {
    return (
        <button
            type="button"
            onClick={() => onToggle(exercise.id)}
            aria-pressed={selected}
            className={`w-full rounded-lg border p-3 text-left transition-colors font-medium ${selected
                    ? "border-green-500 bg-green-100 text-green-900"
                    : "border-slate-300 bg-gray-200 text-slate-900 hover:bg-slate-100"
                }`}
        >
            <span className="flex items-center justify-between">
                <span>{exercise.name}</span>
                {selected && (
                    <span className="font-semibold text-green-700">
                        ✓ Selected
                    </span>
                )}
            </span>
        </button>
    );
}

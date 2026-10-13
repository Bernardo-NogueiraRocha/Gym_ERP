'use client';

import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { professionals, exercises } from "@/db/schema";
import { ExerciseList } from "./exercise-list";

type Professional = InferSelectModel<typeof professionals>;
type Exercise = InferSelectModel<typeof exercises>;

interface WorkoutRegisterFormProps {
    professional: Professional;
    exercises: Exercise[];
}

export function WorkoutRegisterForm({ professional, exercises }: WorkoutRegisterFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
    };

    return (
        <div className="w-full px-4 mt-5">
            <form
                onSubmit={handleSubmit}
                className="mx-auto mt-2 w-full max-w-2xl space-y-4 rounded-2xl border-2 p-6"
            >
                <h2 className="text-center text-2xl font-semibold text-slate-100">
                    Register Workout
                </h2>

                <ExerciseList exerciseList={exercises} />
            </form>
        </div>
    );
}
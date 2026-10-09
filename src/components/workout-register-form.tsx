'use client';

import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { professionals } from "@/db/schema";

type Professional = InferSelectModel<typeof professionals>;

interface WorkoutRegisterFormProps {
    professional: Professional;
}

export function WorkoutRegisterForm({ professional }: WorkoutRegisterFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.SubmitEvent) => { e.preventDefault(); }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Register Workout for {professional.userId}</h2>
        </form>
    );
}
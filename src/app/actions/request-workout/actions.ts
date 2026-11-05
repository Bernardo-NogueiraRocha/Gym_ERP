'use server';

import { getDb } from "@/db";
import { workoutRequests } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type NewWorkoutRequest = InferInsertModel<typeof workoutRequests>;

export async function requestWorkoutAction(request: NewWorkoutRequest) {
    try {
        await getDb()
            .insert(workoutRequests)
            .values(request);
    } catch (error) {
        console.error("SERVER ACTION ERROR:", error);
        throw new Error("Failed to save workout request.");
    }
}
import {workoutItems, workouts} from '@/db/schema'
import { getDb } from '@/db'
import { eq } from 'drizzle-orm'

export async function getWorkoutItems(workoutId:string) {
    const result = await getDb()
        .select()
        .from(workoutItems)
        .where(eq(workoutItems.workoutId, workoutId));
    return result;
}

export async function getWorkoutData(workoutId:string) {
    const [result] = await getDb()
        .select()
        .from(workouts)
        .where(eq(workouts.id, workoutId))
        .limit(1);
    return result
}
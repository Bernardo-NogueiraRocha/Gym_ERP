import { getDb } from "@/db";
import { plans } from '@/db/schema';

export async function getPlans() {
    const result = await getDb()
        .select()
        .from(plans);

    return result;
}
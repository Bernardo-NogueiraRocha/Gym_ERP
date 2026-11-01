import { getDb } from "@/db";
import { plans } from '@/db/schema';
import { eq } from "drizzle-orm";

export async function getPlans() {
    const result = await getDb()
        .select()
        .from(plans);

    return result;
}

export async function getPlanById(planId:string) {
    const [result] = await getDb()
        .select()
        .from(plans)
        .where(eq(plans.id,planId));

    return result;
}
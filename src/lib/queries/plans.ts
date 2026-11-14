import { getDb } from "@/db";
import { features, planFeatures, plans } from '@/db/schema';
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

export async function getPlansWithFeatures() {
    const db = getDb();
    const [planRows, featureRows, assignments] = await Promise.all([
        db.select().from(plans).orderBy(plans.basePrice),
        db.select().from(features).orderBy(features.name),
        db.select({ planId: planFeatures.planId, featureId: planFeatures.featureId })
            .from(planFeatures)
            .where(eq(planFeatures.included, true)),
    ]);

    const featureById = new Map(featureRows.map((feature) => [feature.id, feature]));
    const featuresByPlan = new Map<string, typeof featureRows>();
    for (const assignment of assignments) {
        const feature = featureById.get(assignment.featureId);
        if (!feature) continue;
        const planFeaturesList = featuresByPlan.get(assignment.planId) ?? [];
        planFeaturesList.push(feature);
        featuresByPlan.set(assignment.planId, planFeaturesList);
    }

    return {
        plans: planRows.map((plan) => ({ ...plan, features: featuresByPlan.get(plan.id) ?? [] })),
        features: featureRows,
        includedFeatureIdsByPlan: Object.fromEntries(
            planRows.map((plan) => [plan.id, new Set(featuresByPlan.get(plan.id)?.map((feature) => feature.id) ?? [])]),
        ),
    };
}

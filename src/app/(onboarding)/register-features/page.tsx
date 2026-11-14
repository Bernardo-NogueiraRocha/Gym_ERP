import { getDb } from '@/db';
import { features, planFeatures, plans, user } from '@/db/schema';
import { getSession } from '@/lib/auth-server';
import { AccessDenied } from '@/components/access-denied';
import { FeatureManager } from '@/components/features/feature-manager';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manage Features | GYM_ERP',
    description: 'Register features and configure which plans include them.',
};

export default async function RegisterFeaturesPage() {
    const session = await getSession();
    if (!session) return <AccessDenied message="You must be logged in to access this page." />;

    const db = getDb();
    const [account] = await db.select({ role: user.role })
        .from(user)
        .where(eq(user.id, session.user.id)).limit(1);
    if (account?.role !== 'admin') return <AccessDenied message="Administrator access is required to manage features." />;

    const [planList, featureList, assignments] = await Promise.all([
        db.select().from(plans).orderBy(plans.name),
        db.select().from(features).orderBy(features.name),
        db.select().from(planFeatures),
    ]);
    const assignedPlanIdsByFeature: Record<string, string[]> = {};
    for (const assignment of assignments) {
        if (!assignment.included) continue;
        (assignedPlanIdsByFeature[assignment.featureId] ??= []).push(assignment.planId);
    }

    return <FeatureManager plans={planList} features={featureList} assignedPlanIdsByFeature={assignedPlanIdsByFeature} />;
}

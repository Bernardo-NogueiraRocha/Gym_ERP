'use server';

import { getDb } from '@/db';
import { features, planFeatures, plans, user } from '@/db/schema';
import { getSession } from '@/lib/auth-server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
    const session = await getSession();
    if (!session) throw new Error('You must be signed in.');
    const [admin] = await getDb().select({ role: user.role })
        .from(user)
        .where(eq(user.id, session.user.id)).limit(1);
    if (admin?.role !== 'admin') throw new Error('Administrator access required.');
}

export async function saveFeatureAction(input: {
    id?: string;
    name: string;
    description: string;
    planIds: string[];
}) {
    try {
        await requireAdmin();
        const name = input.name.trim();
        const description = input.description.trim();
        const planIds = [...new Set(input.planIds)];
        if (name.length < 1 || name.length > 150) return { success: false, error: 'Feature name must be between 1 and 150 characters.' };
        if (description.length > 5000) return { success: false, error: 'Description is too long.' };

        const db = getDb();
        const availablePlans = await db.select({ id: plans.id }).from(plans);
        const availablePlanIds = new Set(availablePlans.map((plan) => plan.id));
        if (planIds.some((id) => !availablePlanIds.has(id))) return { success: false, error: 'One or more selected plans are invalid.' };

        await db.transaction(async (tx) => {
            let featureId = input.id;
            if (featureId) {
                const [existing] = await tx.select({ id: features.id }).from(features).where(eq(features.id, featureId)).limit(1);
                if (!existing) throw new Error('Feature not found.');
                await tx.update(features).set({ name, description: description || null }).where(eq(features.id, featureId));
                await tx.delete(planFeatures).where(eq(planFeatures.featureId, featureId));
            } else {
                const [created] = await tx.insert(features).values({ name, description: description || null }).returning({ id: features.id });
                featureId = created.id;
            }
            if (planIds.length) {
                await tx.insert(planFeatures).values(planIds.map((planId) => ({ planId, featureId: featureId!, included: true })));
            }
        });
        revalidatePath('/register-features');
        revalidatePath('/plans');
        return { success: true };
    } catch (error) {
        console.error('Failed to save feature:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unable to save feature.' };
    }
}

export async function deleteFeatureAction(featureId: string) {
    try {
        await requireAdmin();
        await getDb().delete(features).where(eq(features.id, featureId));
        revalidatePath('/register-features');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete feature:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unable to delete feature.' };
    }
}

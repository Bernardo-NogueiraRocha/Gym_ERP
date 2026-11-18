import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { getDb } from './index';
import * as schema from './schema';
import {
    exerciseData,
    featureData,
    muscleData,
    planData,
    planFeatureRules,
} from './reference-data';

/**
 * Non-destructive initializer for production/reference data.
 *
 * Only inserts catalog rows that do not exist yet. It never deletes or updates
 * user data, so it is safe to run against a live database.
 */
async function main() {
    const db = getDb();

    try {
        // Muscles (slug is unique)
        const existingMuscles = await db
            .select({ id: schema.muscles.id, slug: schema.muscles.slug })
            .from(schema.muscles);
        const muscleIdBySlug = new Map(existingMuscles.map((muscle) => [muscle.slug, muscle.id]));

        const missingMuscles = muscleData.filter((muscle) => !muscleIdBySlug.has(muscle.slug));
        if (missingMuscles.length) {
            const inserted = await db
                .insert(schema.muscles)
                .values(missingMuscles)
                .returning({ id: schema.muscles.id, slug: schema.muscles.slug });
            inserted.forEach((muscle) => muscleIdBySlug.set(muscle.slug, muscle.id));
        }

        // Exercises (no unique constraint on name, matched by name)
        const existingExercises = await db
            .select({ id: schema.exercises.id, name: schema.exercises.name })
            .from(schema.exercises);
        const exerciseIdByName = new Map(existingExercises.map((exercise) => [exercise.name, exercise.id]));

        const missingExercises = exerciseData.filter((exercise) => !exerciseIdByName.has(exercise.name));
        if (missingExercises.length) {
            const inserted = await db
                .insert(schema.exercises)
                .values(missingExercises.map(({ name }) => ({ name })))
                .returning({ id: schema.exercises.id, name: schema.exercises.name });
            inserted.forEach((exercise) => exerciseIdByName.set(exercise.name, exercise.id));
        }

        // Exercise -> muscle stimulus links (composite primary key)
        const exerciseMuscleRows = exerciseData.flatMap((exercise) => {
            const exerciseId = exerciseIdByName.get(exercise.name);
            if (!exerciseId) return [];

            return exercise.muscles.flatMap((muscle) => {
                const muscleId = muscleIdBySlug.get(muscle.slug);
                if (!muscleId) return [];

                return [{
                    exerciseId,
                    muscleId,
                    stimulusStrength: muscle.stimulusStrength,
                }];
            });
        });

        if (exerciseMuscleRows.length) {
            await db.insert(schema.exerciseMuscles).values(exerciseMuscleRows).onConflictDoNothing();
        }

        // Plans (matched by billing cycle so renames are not overwritten)
        const existingPlans = await db
            .select({ id: schema.plans.id, billingCycle: schema.plans.billingCycle })
            .from(schema.plans);
        const planIdByCycle = new Map(existingPlans.map((plan) => [plan.billingCycle, plan.id]));

        const missingPlans = planData.filter((plan) => !planIdByCycle.has(plan.billingCycle));
        if (missingPlans.length) {
            const inserted = await db
                .insert(schema.plans)
                .values(missingPlans)
                .returning({ id: schema.plans.id, billingCycle: schema.plans.billingCycle });
            inserted.forEach((plan) => planIdByCycle.set(plan.billingCycle, plan.id));
        }

        // Features (no unique constraint on name, matched by name)
        const existingFeatures = await db
            .select({ id: schema.features.id, name: schema.features.name })
            .from(schema.features);
        const featureIdByName = new Map(existingFeatures.map((feature) => [feature.name, feature.id]));

        const missingFeatures = featureData.filter((feature) => !featureIdByName.has(feature.name));
        if (missingFeatures.length) {
            const inserted = await db
                .insert(schema.features)
                .values(missingFeatures)
                .returning({ id: schema.features.id, name: schema.features.name });
            inserted.forEach((feature) => featureIdByName.set(feature.name, feature.id));
        }

        // Plan -> feature links (composite primary key)
        const planFeatureRows = planFeatureRules.flatMap((rule) => {
            const planId = planIdByCycle.get(rule.planCycle);
            const featureId = featureIdByName.get(rule.featureName);
            if (!planId || !featureId) return [];

            return [{ planId, featureId, included: rule.included }];
        });

        if (planFeatureRows.length) {
            await db.insert(schema.planFeatures).values(planFeatureRows).onConflictDoNothing();
        }

        console.log('Reference data is up to date (no existing rows were modified).');
    } catch (error) {
        console.error(
            'Initialization failed:',
            error instanceof Error ? error.message : error,
        );
        process.exitCode = 1;
    } finally {
        process.exit();
    }
}

void main();

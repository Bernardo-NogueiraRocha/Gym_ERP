import { pgTable, uuid, varchar, text, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { plans } from './plans';

export const features = pgTable('features', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull(),
    description: text('description'),
});

export const planFeatures = pgTable('plan_features', {
    planId: uuid('plan_id')
        .notNull()
        .references(() => plans.id, { 
            onDelete: 'cascade' 
        }),
    featureId: uuid('feature_id')
        .notNull()
        .references(() => features.id, { onDelete: 'cascade' }),
    included: boolean('included').default(true).notNull(),
}, 
    (table) => [
        primaryKey({
            columns: [table.planId, table.featureId],
        }),
    ]
);
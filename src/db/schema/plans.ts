import { 
  pgTable, uuid, timestamp, numeric, varchar} from 'drizzle-orm/pg-core';
import { billingEnum } from './enums';

export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  billingCycle: billingEnum('billing_cycle').notNull(),
  basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});
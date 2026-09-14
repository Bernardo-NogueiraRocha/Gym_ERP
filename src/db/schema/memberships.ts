import { 
  pgTable, uuid, text, numeric, date} from 'drizzle-orm/pg-core';
import { students } from './students';
import { plans } from './plans';
import { membershipStatusEnum } from './enums';

export const memberships = pgTable('memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(
    () => students.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
  planId: uuid('plan_id').references(
    () => plans.id, { onDelete: 'restrict', onUpdate: 'cascade' }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  appliedDiscount: numeric('applied_discount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  status: membershipStatusEnum('status').default('pending').notNull(),
  contractUrl: text('contract_url'),
});

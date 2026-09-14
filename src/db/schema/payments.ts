import { 
  pgTable, uuid, numeric, date} from 'drizzle-orm/pg-core';
import { memberships } from './memberships';
import { paymentStatusEnum } from './enums';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  membershipId: uuid('membership_id').references(
    () => memberships.id, { onDelete: 'restrict' }
  ).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  paymentDate: date('payment_date'),
  status: paymentStatusEnum('status').notNull(),
});
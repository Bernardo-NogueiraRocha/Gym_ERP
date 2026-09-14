import { 
  pgTable, uuid, text, numeric, varchar, date} from 'drizzle-orm/pg-core';
import { expenseCategoryEnum } from './enums';

export const expenseBills = pgTable('expense_bills', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: expenseCategoryEnum('category').notNull(),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  paymentDate: date('payment_date'),
  type: varchar('type', { length: 100 }),
});

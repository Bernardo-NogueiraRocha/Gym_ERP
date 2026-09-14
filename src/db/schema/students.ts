import { 
  pgTable, uuid, text, timestamp, varchar} from 'drizzle-orm/pg-core';
import { studentStatusEnum } from './enums';
import {user} from './auth';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  cpf: varchar('cpf', { length: 11 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  status: studentStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

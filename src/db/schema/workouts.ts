import { 
  pgTable, uuid, varchar, date} from 'drizzle-orm/pg-core';
import { students } from './students';
import { professionals } from './professionals';

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(
    () => students.id, { onDelete: 'cascade', onUpdate: 'cascade' }
  ).notNull(),
  prescribedByProfessionalId: uuid('prescribed_by_professional_id').references(
    () => professionals.id, { onDelete: 'set null', onUpdate: 'set null' }
  ),
  title: varchar('title', { length: 50 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
});
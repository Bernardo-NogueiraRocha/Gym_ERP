import { 
  pgTable, uuid, timestamp} from 'drizzle-orm/pg-core';
import { classSchedules } from './classSchedules';
import { students } from './students';

export const classAttendances = pgTable('class_attendances', {
  id: uuid('id').defaultRandom().primaryKey(),
  scheduleId: uuid('schedule_id').references(
    () => classSchedules.id, { onDelete: 'cascade' }
  ).notNull(),
  studentId: uuid('student_id').references(
    () => students.id, { onDelete: 'cascade' }
  ).notNull(),
  attendedAt: timestamp('attended_at').defaultNow().notNull(),
});
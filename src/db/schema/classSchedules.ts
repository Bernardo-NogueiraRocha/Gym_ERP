import { 
  pgTable, uuid, time} from 'drizzle-orm/pg-core';
import { classes } from './classes';
import { professionals } from './professionals';
import { dayOfWeekEnum } from './enums';

export const classSchedules = pgTable('class_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id').references(
    () => classes.id, { onDelete: 'cascade', onUpdate: 'cascade' }
  ).notNull(),
  professionalId: uuid('professional_id').references(
    () => professionals.id, { onDelete: 'cascade', onUpdate: 'cascade' }
  ).notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  dayWeek: dayOfWeekEnum('day_week').notNull(),
});
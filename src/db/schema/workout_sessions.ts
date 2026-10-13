import { pgTable, integer, timestamp, uuid, numeric, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { exercises } from './exercises';
import { workouts } from './workouts';
import { students } from './students';

export const sessionStatusEnum = pgEnum('session_status', ['in_progress', 'completed', 'abandoned']);

export const workoutSessions = pgTable('workout_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  workoutId: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  status: sessionStatusEnum('status').notNull().default('in_progress'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const workoutSessionSets = pgTable('workout_session_sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id),
  setNumber: integer('set_number').notNull(),
  targetReps: integer('target_reps').notNull(),
  actualReps: integer('actual_reps'),
  actualWeight: numeric('actual_weight', { precision: 6, scale: 2 }),
  completed: boolean('completed').default(false).notNull(),
});
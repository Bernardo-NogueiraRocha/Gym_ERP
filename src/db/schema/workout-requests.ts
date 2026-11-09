import { pgTable, text, timestamp, uuid, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { students } from './students';

export const experienceLevelEnum = pgEnum('experience_level', [
  'beginner',     // Never stepped in a gym or < 6 months
  'intermediate', // 6 months to 2 years consistent training
  'advanced',     // 2+ years consistent training
]);

export const workoutRequests = pgTable('workout_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  experienceLevel: experienceLevelEnum('experience_level').notNull(),
  priorities: text('priorities').notNull(), // e.g., "Hypertrophy, fat loss, core strength"
  focusedMuscles: text('focused_muscles').notNull(), // e.g., "Chest, Glutes, Shoulders"
  
  hasInjuries: boolean('has_injuries').default(false).notNull(),
  injuryDetails: text('injury_details'), // Nullable, filled only if hasInjuries is true
  solved: boolean('solved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
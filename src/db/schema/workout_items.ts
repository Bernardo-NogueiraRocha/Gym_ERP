import { 
  pgTable, uuid, integer} from 'drizzle-orm/pg-core';
import { workouts } from './workouts';
import { exercises } from './exercises';

export const workoutItems = pgTable('workout_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id').references(
    () => workouts.id, { onDelete: 'cascade', onUpdate: 'cascade' }
  ).notNull(),
  exerciseId: uuid('exercise_id').references(
    () => exercises.id, { onDelete: 'restrict', onUpdate: 'cascade' }
  ).notNull(),
  sets: integer('sets').notNull(),
  reps: integer('reps').notNull(),
  restSeconds: integer('rest_seconds').default(30).notNull(),
});
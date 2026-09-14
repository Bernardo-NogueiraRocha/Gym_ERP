import { 
  pgTable, uuid, text, varchar} from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  targetMuscles: text('target_muscles').notNull(),
});
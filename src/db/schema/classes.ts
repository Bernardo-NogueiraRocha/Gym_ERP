import { 
  pgTable, uuid, varchar, integer} from 'drizzle-orm/pg-core';

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  capacity: integer('capacity').notNull(),
});
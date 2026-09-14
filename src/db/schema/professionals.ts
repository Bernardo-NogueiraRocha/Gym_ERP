import { 
  pgTable, uuid, text, varchar} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const professionals = pgTable('professionals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  cref: varchar('cref', { length: 20 }),
  specialty: text('specialty'),
});
import {
    pgTable,
    uuid,
    timestamp,
    primaryKey,
} from 'drizzle-orm/pg-core';

import { professionals } from './professionals';
import { students } from './students';

export const professionalStudents = pgTable('professional_students',{
    professionalId: uuid('professional_id')
        .notNull()
        .references(() => professionals.id, {
            onDelete: 'cascade',
        }),
    studentId: uuid('student_id')
        .notNull()
        .references(() => students.id, {
            onDelete: 'cascade',
        }),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
},
    (table) => [
        primaryKey({
            columns: [table.professionalId, table.studentId],
        }),
    ],
);
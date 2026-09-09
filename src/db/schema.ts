import { pgTable, uuid, text, timestamp, numeric, varchar, char, pgEnum, date } from 'drizzle-orm/pg-core';

export const student_status_enum = pgEnum('status', ['ACTIVE', 'SUSPENDED', 'CANCELLED']);

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  documentCpf: char('document_cpf', { length: 11 }).unique(),
  photoUrl: text('photo_url'),
  address: text('address'),
  status: student_status_enum('status').default('ACTIVE').notNull(),
  email: text('email').notNull().unique(),
  notesHistory: text('notes_history'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const billing_enum = pgEnum('billing_cycle', ['MENSAL', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL']);

export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  billingCycle: billing_enum('billing_cycle').notNull(),
  basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(), // Fixed column name
});

export const studentPlanStatusEnum = pgEnum('student_plan_status', [
  'pending',
  'active',
  'frozen',
  'expired',
  'canceled',
  'suspended',
]);

export const studentPlan = pgTable('student_plan', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(
    () => students.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
  planId: uuid('plan_id').references(
    () => plans.id, { onDelete: 'restrict', onUpdate: 'cascade' }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  appliedDiscount: numeric('applied_discount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  status: studentPlanStatusEnum('status').default('pending').notNull(),
  contractUrl: text('contract_url'),
});

// export const professionals = pgTable('professionals', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: text('name').notNull(),
//   working_hours: text('working_hours').notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
// });


// export const workouts = pgTable('workouts', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   student_id: uuid('student_id').references(
//     ()=> students.id , {onDelete:'cascade', onUpdate:'cascade'}),

//   prescribed_by_professional_id: uuid('prescribed_by_professional_id').references(
//     ()=> professionals.id, {onDelete: 'set null', onUpdate:'set null'}
//   )
//   ,
//   billing_cycle: text('billing_cycle'),
//   base_price: numeric('base_price', {precision:2})
// });

// export const workout_items = pgTable('exercises', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', {length:100}).notNull(),
//   target_muscles: text('target_muscles').notNull(),
// });


// export const exercises = pgTable('exercises', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', {length:100}).notNull(),
//   target_muscles: text('target_muscles').notNull(),
// });

// export const expense_bills = pgTable('exercises', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', {length:100}).notNull(),
//   target_muscles: text('target_muscles').notNull(),
// });

// export const class_schedules = pgTable('exercises', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', {length:100}).notNull(),
//   target_muscles: text('target_muscles').notNull(),
// });

// export const class_attendances = pgTable('exercises', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', {length:100}).notNull(),
//   target_muscles: text('target_muscles').notNull(),
// });

// export const payments = pgTable('payments', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: varchar('name', {length:100}).notNull(),
//   target_muscles: text('target_muscles').notNull(),
// });

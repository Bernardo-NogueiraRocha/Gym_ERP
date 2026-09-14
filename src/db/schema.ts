import { 
  pgTable, uuid, text, timestamp, numeric, varchar, pgEnum, date, integer, time, boolean 
} from 'drizzle-orm/pg-core';

export const student_status_enum = pgEnum('status', ['active', 'suspended', 'cancelled']);

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  cpf: varchar('cpf', { length: 11 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  status: student_status_enum().default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const professionals = pgTable('professionals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  cref: varchar('cref', { length: 20 }),
  specialty: text('specialty'),
});

export const billing_enum = pgEnum('billing_cycle', ['mensal', 'quarterly', 'semiannual', 'annual']);

export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  billingCycle: billing_enum('billing_cycle').notNull(),
  basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
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

export const expenseCategoryEnum = pgEnum('expense_category', [
  'salary', 'machinery', 'repair', 'cleaning', 'monthly', 'supplies', 'rent', 'loans'
]);

export const dayOfWeekEnum = pgEnum('day_of_week', [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'completed', 'overdue'
]);

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(
    () => students.id, { onDelete: 'cascade', onUpdate: 'cascade' }
  ).notNull(),
  prescribedByProfessionalId: uuid('prescribed_by_professional_id').references(
    () => professionals.id, { onDelete: 'set null', onUpdate: 'set null' }
  ),
  title: varchar('title', { length: 50 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
});

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  targetMuscles: text('target_muscles').notNull(),
});

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

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  capacity: integer('capacity').notNull(),
});

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

export const expenseBills = pgTable('expense_bills', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: expenseCategoryEnum('category').notNull(),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  paymentDate: date('payment_date'),
  type: varchar('type', { length: 100 }),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentPlanId: uuid('student_plan_id').references(
    () => studentPlan.id, { onDelete: 'restrict' }
  ).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  paymentDate: date('payment_date'),
  status: paymentStatusEnum('status').notNull(),
});

// Better Auth schemas
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
}); 
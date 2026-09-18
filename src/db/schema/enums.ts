import { 
  pgEnum} from 'drizzle-orm/pg-core';

export const studentStatusEnum = pgEnum('status', ['active', 'suspended', 'cancelled']);
export const billingEnum = pgEnum('billing_cycle', ['mensal', 'quarterly', 'semiannual', 'annual']);
export const membershipStatusEnum = pgEnum('membership_status', [
  'pending',
  'active',
  'frozen',
  'expired',
  'canceled',
  'suspended',
]);

export const expenseCategoryEnum = pgEnum('expense_category', [
  'salary', 'machinery', 'repair', 'cleaning', 'monthly', 'supplies', 'rent', 'loans'
]);

export const dayOfWeekEnum = pgEnum('day_of_week', [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'completed', 'overdue'
]);

export const userRole = pgEnum('user_role',['student', 'professional', 'admin']);
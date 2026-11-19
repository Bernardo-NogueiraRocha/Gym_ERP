'use server';

import { getDb } from '@/db';
import { memberships, payments, plans, students } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth-server';
import { isUniqueViolation } from '@/lib/db-errors';
import {
  addFrequencyToDate,
  addMonthsToDate,
  FREQUENCY_MONTHS,
  todayIsoDate,
} from '@/lib/dates';

type NewPayment = typeof payments.$inferInsert;

const subscribeSchema = z.object({
  planId: z.string().uuid('Invalid plan.'),
});

export type SubscribeToPlanResult =
  | { success: true }
  | { success: false; error: string };

const DUPLICATE_MEMBERSHIP =
  'You already have a pending or active membership.';

export async function subscribeToPlanAction(input: {
  planId: string;
}): Promise<SubscribeToPlanResult> {
  // The student identity comes from the session, never from the caller.
  const session = await getSession().catch(() => null);
  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in to subscribe to a plan.' };
  }

  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Invalid plan.' };
  }

  try {
    const db = getDb();

    const [student] = await db
      .select({ id: students.id, status: students.status })
      .from(students)
      .where(eq(students.userId, session.user.id))
      .limit(1);

    if (!student) {
      return { success: false, error: 'Only students can subscribe to a plan.' };
    }

    if (student.status !== 'active') {
      return { success: false, error: 'Your student account is not active.' };
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, parsed.data.planId))
      .limit(1);

    if (!plan) {
      return { success: false, error: 'Plan not found.' };
    }

    // One live membership per student. The partial unique index in the schema
    // enforces this too; this check provides a friendly error in the normal case.
    const [liveMembership] = await db
      .select({ id: memberships.id })
      .from(memberships)
      .where(
        and(
          eq(memberships.studentId, student.id),
          inArray(memberships.status, ['pending', 'active']),
        ),
      )
      .limit(1);

    if (liveMembership) {
      return { success: false, error: DUPLICATE_MEMBERSHIP };
    }

    const startDate = todayIsoDate();
    const endDate = addFrequencyToDate(startDate, plan.billingCycle);
    const installmentCount = FREQUENCY_MONTHS[plan.billingCycle];

    // Membership and its payment schedule are created atomically: a failure
    // while creating payments must not leave a membership without invoices.
    await db.transaction(async (tx) => {
      const [membership] = await tx
        .insert(memberships)
        .values({
          studentId: student.id,
          planId: plan.id,
          startDate,
          endDate,
          appliedDiscount: '0.00',
          status: 'pending',
        })
        .returning({ id: memberships.id });

      const paymentValues: NewPayment[] = Array.from(
        { length: installmentCount },
        (_, index) => ({
          amount: String(plan.basePrice),
          status: 'pending',
          dueDate: addMonthsToDate(startDate, index),
          membershipId: membership.id,
        }),
      );

      await tx.insert(payments).values(paymentValues);
    });

    revalidatePath('/');
    revalidatePath('/plans');
    revalidatePath('/account');

    return { success: true };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { success: false, error: DUPLICATE_MEMBERSHIP };
    }

    console.error('Failed to create membership.');
    return {
      success: false,
      error: 'Could not create your membership. Please try again.',
    };
  }
}

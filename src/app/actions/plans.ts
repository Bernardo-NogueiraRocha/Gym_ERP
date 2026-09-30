'use server';

import { getDb } from "@/db";
import { students, memberships, billingEnum, plans, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type Frequency = (typeof billingEnum.enumValues)[number];

const FREQUENCY_MONTHS: Record<Frequency, number> = {
  'mensal': 1,
  'quarterly': 3,
  'semiannual': 6,
  'annual': 12,
};

function addFrequencyToDate(startDateStr: string, frequency: Frequency): string {
  const [year, month, day] = startDateStr.split('-').map(Number);
  const result = new Date(year, month - 1, day);

  const monthsToAdd = FREQUENCY_MONTHS[frequency];
  const targetMonthIndex = (result.getMonth() + monthsToAdd) % 12;

  result.setMonth(result.getMonth() + monthsToAdd);

  if (result.getMonth() !== targetMonthIndex) {
    result.setDate(0);
  }

  const yyyy = result.getFullYear();
  const mm = String(result.getMonth() + 1).padStart(2, '0');
  const dd = String(result.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

export async function subscribeToPlanAction({
  planId,
  userId,
}: {
  planId: string;
  userId: string;
}) {
  try {
    const [curr_plan] = await getDb().select().from(plans).where(eq(plans.id, planId));
    if (!curr_plan) {
      return { success: false, error: 'Plan not found.' };
    }

    console.log(userId)
    const [curr_student] = await getDb()
      .select()
      .from(students)
      .where(eq(students.userId, userId))
      .limit(1);

    if (!curr_student) {
      return { success: false, error: 'Student record not found for this user.' };
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const startDate = `${yyyy}-${mm}-${dd}`;

    const endDate = addFrequencyToDate(startDate, curr_plan.billingCycle);

    await getDb().insert(memberships).values({
      studentId: curr_student.id,
      planId: planId,
      startDate: startDate,
      endDate: endDate,
      appliedDiscount: '0.00',
      status: 'pending',
    });

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    // Log actual error details to your terminal output for easy debugging
    console.error('Subscription insertion error:', error?.detail || error?.message || error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Database insertion failed.',
    };
  }
}
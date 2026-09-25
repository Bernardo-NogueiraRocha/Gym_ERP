'use server';

import { getDb } from "@/db";
import { students, memberships, billingEnum, plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type Frequency = (typeof billingEnum.enumValues)[number];

const FREQUENCY_MONTHS: Record<Frequency, number> = {
  'mensal': 1,
  'quarterly': 3,
  'semiannual': 6,
  'annual': 12,
};

function addFrequencyToDate(startDate: string, frequency: Frequency): string {
  const result = new Date(startDate);
  const monthsToAdd = FREQUENCY_MONTHS[frequency];
  
  const currentDay = result.getDate();
  result.setMonth(result.getMonth() + monthsToAdd);

  // Handle month-end rollover edge cases (e.g., Jan 31 + 1 month -> Feb 28/29 instead of Mar 2/3)
  if (result.getDate() !== currentDay) {
    result.setDate(0); // Sets date to the last day of the intended month
  }

  return result.toISOString().split('T')[0];
}

export async function subscribeToPlanAction(
    {
        planId,
        userId,
        cpf,
        phone
    }: {
        planId: string;
        userId: string;
        cpf : string;
        phone: string;
    }){
    try {
        // Insert new student record linked to the selected plan

        const [curr_plan] = await getDb().select().from(plans).where(eq(plans.id, planId));

        const [curr_student] = await getDb().insert(students).values({
            userId: userId,
            status: 'active',
            createdAt: new Date(),
            cpf: cpf,
            phone: phone,
        }).returning();

        const startDate = new Date().toISOString().split('T')[0];
        const endDate = addFrequencyToDate(startDate, curr_plan.billingCycle);
        await getDb().insert(memberships).values({
            studentId: curr_student.id,
            planId: planId,
            startDate: startDate,
            endDate: endDate,
            appliedDiscount: '0.00',
            status: 'pending',            
        })

        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Error creating student registration:', error);
        return { success: false, error: 'Database insertion failed.' };
    }
}
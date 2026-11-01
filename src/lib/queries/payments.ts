import { getDb } from "@/db";
import { memberships, payments, students } from "@/db/schema";
import { eq } from "drizzle-orm";

/** Returns every membership payment belonging to the authenticated user. */
export async function getPaymentsByUserId(userId: string) {
  return getDb()
    .select({
      id: payments.id,
      membershipId: payments.membershipId,
      amount: payments.amount,
      dueDate: payments.dueDate,
      paymentDate: payments.paymentDate,
      status: payments.status,
    })
    .from(payments)
    .innerJoin(memberships, eq(payments.membershipId, memberships.id))
    .innerJoin(students, eq(memberships.studentId, students.id))
    .where(eq(students.userId, userId))
    .orderBy(payments.dueDate);
}

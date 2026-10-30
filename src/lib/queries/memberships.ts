import { getDb } from "@/db";
import { plans, memberships, students } from '@/db/schema';
import { eq } from "drizzle-orm";

export async function getMembershipPlanId(userId: string) {
    const [student] = await getDb()
        .select({ id: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

    if (!student) {
        return null;
    }

    const [membership] = await getDb()
        .select({ planId: memberships.planId })
        .from(memberships)
        .where(eq(memberships.studentId, student.id))
        .limit(1);

    return membership?.planId ?? null;
}

import { getDb } from "@/db";
import { memberships, students } from '@/db/schema';
import { and, desc, eq, inArray } from "drizzle-orm";

const LIVE_STATUSES = ['pending', 'active'] as const;

async function getStudentId(userId: string) {
    const [student] = await getDb()
        .select({ id: students.id })
        .from(students)
        .where(eq(students.userId, userId))
        .limit(1);

    return student?.id ?? null;
}

export async function getMembershipPlanId(userId: string) {
    const studentId = await getStudentId(userId);
    if (!studentId) return null;

    // Only a pending/active membership counts as the current plan; canceled or
    // expired memberships must not block subscribing again.
    const [membership] = await getDb()
        .select({ planId: memberships.planId })
        .from(memberships)
        .where(
            and(
                eq(memberships.studentId, studentId),
                inArray(memberships.status, [...LIVE_STATUSES]),
            ),
        )
        .limit(1);

    return membership?.planId ?? null;
}

export async function getMembershipUser(userId: string) {
    const studentId = await getStudentId(userId);
    if (!studentId) return null;

    const [liveMembership] = await getDb()
        .select()
        .from(memberships)
        .where(
            and(
                eq(memberships.studentId, studentId),
                inArray(memberships.status, [...LIVE_STATUSES]),
            ),
        )
        .limit(1);

    if (liveMembership) return liveMembership;

    const [latestMembership] = await getDb()
        .select()
        .from(memberships)
        .where(eq(memberships.studentId, studentId))
        .orderBy(desc(memberships.startDate))
        .limit(1);

    return latestMembership;
}

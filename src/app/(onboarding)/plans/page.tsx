import { PlanButton } from "@/components/plans/plan-button";
import { getDb } from "@/db";
import { plans, memberships, students, user } from '@/db/schema';
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getPlans() {
    const result = await getDb()
        .select()
        .from(plans);

    return result;
}

// Type of a single row from getPlans()
type Plan = Awaited<ReturnType<typeof getPlans>>[number];

// the props object with the single Plan type
function PlanCard({
    plan,
    membershipPlanId,
}: {
    plan: Plan;
    membershipPlanId: string | null;
}) {
    const isCurrentPlan = plan.id === membershipPlanId;

    return (
        <li>
            <span>
                {plan.name} <br />
                ${plan.basePrice} <br />
            </span>

            <PlanButton
                planId={plan.id}
                isCurrentPlan={isCurrentPlan}
            />
        </li>
    );
}

function PlanCards(
    {
        plansArray,
        membershipPlanId,
    }:
        {
            plansArray: Plan[];
            membershipPlanId: string | null;
        }) {
    if (plansArray.length === 0) {
        return (
            <div className="rounded-md bg-zinc-900 p-4 text-sm text-zinc-400">
                No plans registered in database.
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-4">
            {plansArray.map((plan) => (
                <PlanCard
                    key={plan.id}
                    plan={plan}
                    membershipPlanId={membershipPlanId}
                />
            ))}
        </ul>
    );
}
async function getMembershipPlanId(userId: string) {
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

export default async function PlansPage() {
    const plans = await getPlans();

    const session = await auth.api.getSession({ headers: await headers() });

    const userId = session?.user?.id ?? null;

    const membershipPlanId = userId
        ? await getMembershipPlanId(userId)
        : null;

    return (
        <div>
            <PlanCards
                plansArray={plans}
                membershipPlanId={membershipPlanId}
            />
        </div>
    );
}
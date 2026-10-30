import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPlans } from "@/lib/queries/plans";
import { getMembershipPlanId } from "@/lib/queries/memberships";
import { PlanCards } from "@/components/plans/plan-cards";

type Plan = Awaited<ReturnType<typeof getPlans>>[number];


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
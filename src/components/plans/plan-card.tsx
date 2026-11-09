import { PlanButton } from "@/components/plans/plan-button";
import type { Plan } from "@/lib/types";
export function PlanCard({
    plan,
    membershipPlanId,
}: {
    plan: Plan;
    membershipPlanId: string | null;
}) {
    const isCurrentPlan = plan.id === membershipPlanId;

    return (
        <li className="text-center border-2 border-r-4 border-white">
            <span className="text-xl font-semibold mt-5">
                {plan.name} <br />
            </span>
            <span>${plan.basePrice} <br /></span>

            <PlanButton
                planId={plan.id}
                isCurrentPlan={isCurrentPlan}
            />
        </li>
    );
}


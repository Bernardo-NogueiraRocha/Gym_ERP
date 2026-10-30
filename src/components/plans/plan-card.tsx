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


import { PlanCard } from "./plan-card";
import type { Plan } from "@/lib/types";

export function PlanCards(
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
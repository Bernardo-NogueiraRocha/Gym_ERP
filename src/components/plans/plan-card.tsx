import { PlanButton } from "@/components/plans/plan-button";
import type { getPlansWithFeatures } from "@/lib/queries/plans";
type Plan = Awaited<ReturnType<typeof getPlansWithFeatures>>["plans"][number];
export function PlanCard({
    plan,
    membershipPlanId,
}: {
    plan: Plan;
    membershipPlanId: string | null;
}) {
    const isCurrentPlan = plan.id === membershipPlanId;

    return (
        <li className="flex flex-col rounded-xl border bg-card p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-2 text-2xl font-bold">${plan.basePrice}<span className="text-sm font-normal text-muted-foreground"> / per month</span></p>
            <PlanButton
                planId={plan.id}
                isCurrentPlan={isCurrentPlan}
                hasLiveMembership={membershipPlanId !== null}
            />
            <div className="mt-6 border-t pt-5 text-left">
                <h3 className="text-sm font-semibold">Included features</h3>
                {plan.features.length ? (
                    <ul className="mt-3 space-y-2">
                        {plan.features.map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2 text-sm">
                                <span aria-hidden="true" className="font-bold text-green-700">✓</span>
                                <span>{feature.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className="mt-3 text-sm text-muted-foreground">No features included.</p>}
            </div>
        </li>
    );
}

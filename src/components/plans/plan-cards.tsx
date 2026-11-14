import { PlanCard } from "./plan-card";
import type { getPlansWithFeatures } from "@/lib/queries/plans";

type PlansWithFeatures = Awaited<ReturnType<typeof getPlansWithFeatures>>;
type PlanWithFeatures = PlansWithFeatures["plans"][number];
type Feature = PlansWithFeatures["features"][number];

export function PlanCards(
    {
        plansArray,
        membershipPlanId,
        features,
        includedFeatureIdsByPlan,
    }:
        {
            plansArray: PlanWithFeatures[];
            membershipPlanId: string | null;
            features: Feature[];
            includedFeatureIdsByPlan: Record<string, Set<string>>;
        }) {
    return (
        <div className="mx-auto max-w-7xl space-y-14 px-5 py-10 sm:px-8">
            {plansArray.length === 0 ? (
                <p className="rounded-xl border p-6 text-sm text-muted-foreground">No plans registered in database.</p>
            ) : (
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {plansArray.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} membershipPlanId={membershipPlanId} />
                    ))}
                </ul>
            )}

            <section aria-labelledby="feature-comparison-heading" className="space-y-5">
                <div>
                    <h2 id="feature-comparison-heading" className="text-2xl font-bold">Compare plan features</h2>
                    <p className="mt-1 text-sm text-muted-foreground">See which features are included with each plan.</p>
                </div>
                {features.length === 0 ? (
                    <p className="rounded-xl border p-6 text-sm text-muted-foreground">No features have been registered yet.</p>
                ) : (
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full min-w-max border-collapse text-left text-sm">
                            <thead className="bg-muted/60">
                                <tr>
                                    <th scope="col" className="sticky left-0 z-10 bg-muted/90 px-4 py-3 font-semibold">Feature</th>
                                    {plansArray.map((plan) => <th scope="col" key={plan.id} className="px-4 py-3 text-center font-semibold">{plan.name}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature) => (
                                    <tr key={feature.id} className="border-t">
                                        <th scope="row" className="sticky left-0 bg-background px-4 py-3 font-medium">
                                            <span>{feature.name}</span>
                                            {feature.description && <span className="mt-1 block max-w-xs text-xs font-normal text-muted-foreground">{feature.description}</span>}
                                        </th>
                                        {plansArray.map((plan) => {
                                            const included = includedFeatureIdsByPlan[plan.id]?.has(feature.id) ?? false;
                                            return <td key={plan.id} className="px-4 py-3 text-center">
                                                <span aria-label={included ? 'Included' : 'Not included'} className={included ? 'font-semibold text-green-700' : 'text-muted-foreground'}>{included ? '✓' : '—'}</span>
                                            </td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

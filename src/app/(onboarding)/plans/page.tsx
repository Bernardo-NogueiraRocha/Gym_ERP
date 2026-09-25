import { PlanButton } from "@/components/plans/plan-button";
import { getDb } from "@/db";
import { plans } from '@/db/schema';

async function getPlans() {
    const result = await getDb()
        .select()
        .from(plans);
        
    return result;
}

// Type of a single row from getPlans()
type Plan = Awaited<ReturnType<typeof getPlans>>[number];

// the props object with the single Plan type
function PlanCard({ plan, userId }: { plan: Plan, userId:string }) {
    return (
        <li>
            <span>
                {plan.name} <br/> ${plan.basePrice} <br /> 
            </span>
            <PlanButton planId={plan.id}/>
        </li>
    );
}

function PlanCards({ plansArray, userId }: { plansArray: Awaited<ReturnType<typeof getPlans>>, userId : string }) {
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
                // The key prop belongs inside the map loop
                <PlanCard key={plan.id} plan={plan} userId={userId} />
            ))}
        </ul>
    );
}

export default async function PlansPage({ userId }: { userId: string }) {
    const plans = await getPlans();

    return (
        <div>
            <PlanCards plansArray={plans} userId={userId} />
        </div>
    );
}
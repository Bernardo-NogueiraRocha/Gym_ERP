import { getMembershipUser } from '@/lib/queries/memberships';
import { getPlanById} from '@/lib/queries/plans';

export async function MembershipInfo({ userId }: { userId: string }) {
    const membership = await getMembershipUser(userId);
    if(membership == null){
        return (
            <div>Error Processing Membership.</div>
        );   
    }
    const plan = await getPlanById(membership.planId)
    console.log('UserId:', userId);
    console.log('Plan:', plan);

    return (
        <div>
            <div>
                Plan: {plan.name}
            </div>
            <div>
                Mensal price:{plan.basePrice}
            </div>
            <div>
                Membership status:{membership.status}
            </div>
        </div>
    );
}
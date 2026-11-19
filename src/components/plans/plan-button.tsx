// components/plans/plan-button.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type PlanButtonProps = {
    planId: string;
    isCurrentPlan?: boolean;
    hasLiveMembership?: boolean;
};

export function PlanButton({
    planId,
    isCurrentPlan = false,
    hasLiveMembership = false,
}: PlanButtonProps) {
    if (isCurrentPlan) {
        return (
            <Button
                className="mt-4 w-3/4"
                disabled
            >
                Current Plan
            </Button>
        );
    }

    // One live membership per student for now: don't send users into a
    // checkout that the server will reject.
    if (hasLiveMembership) {
        return (
            <Button
                className="mt-4 w-3/4"
                disabled
            >
                Membership active
            </Button>
        );
    }

    return (
        <Button className="mt-4 w-3/4 mb-5">
            <Link href={`/plans/${planId}/checkout`}>
                Select Plan
            </Link>
        </Button>
    );
}

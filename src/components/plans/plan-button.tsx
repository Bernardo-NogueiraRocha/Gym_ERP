// components/plans/plan-button.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type PlanButtonProps = {
    planId: string;
    isCurrentPlan?: boolean;
};

export function PlanButton({
    planId,
    isCurrentPlan = false,
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

    return (
        <Button className="mt-4 w-3/4 mb-5">
            <Link href={`/plans/${planId}/checkout`}>
                Select Plan
            </Link>
        </Button>
    );
}
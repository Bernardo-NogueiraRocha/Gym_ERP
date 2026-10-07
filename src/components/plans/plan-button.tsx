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
                className="mt-4 w-full"
                disabled
            >
                Current Plan
            </Button>
        );
    }

    return (
        <Button className="mt-4 w-full">
            <Link href={`/plans/${planId}/checkout`}>
                Select Plan
            </Link>
        </Button>
    );
}
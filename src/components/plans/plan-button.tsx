// components/plans/plan-button.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PlanButton({ planId }: { planId: string }) {
  return (
    <Button className="w-full mt-4">
      <Link href={`/plans/${planId}/checkout`}>
        Select Plan
      </Link>
    </Button>
  );
}
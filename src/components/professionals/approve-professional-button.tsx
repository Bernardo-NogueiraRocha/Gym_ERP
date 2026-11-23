'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { approveProfessionalAction } from '@/app/actions/professionals';

export function ApproveProfessionalButton({ professionalId }: { professionalId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    setError(null);

    startTransition(async () => {
      const result = await approveProfessionalAction(professionalId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" onClick={handleApprove} disabled={isPending}>
        {isPending ? 'Approving...' : 'Approve'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

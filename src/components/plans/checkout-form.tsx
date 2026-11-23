'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { subscribeToPlanAction } from '@/app/actions/plans';

interface CheckoutFormProps {
  planId: string;
}

export function CheckoutForm({ planId }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await subscribeToPlanAction({ planId });

      if (!result.success) {
        setErrorMessage(result.error ?? 'An unexpected error occurred.');
      } else {
        router.push('/account');
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">
        Can you confirm that is the plan you want to subscribe to?
      </h3>

      <p className="max-w-prose text-sm text-muted-foreground">
        Your membership will be created as <strong>pending payment</strong>.
        It becomes active once the first payment is confirmed, so it will not
        grant access immediately.
      </p>

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Confirming Enrollment...' : 'Confirm Subscription'}
        </Button>
      </form>
    </div>
  );
}

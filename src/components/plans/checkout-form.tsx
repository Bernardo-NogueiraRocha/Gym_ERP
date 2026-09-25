'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { subscribeToPlanAction } from '@/app/actions/plans';

interface CheckoutFormProps {
  planId: string;
  userId: string;
}

export function CheckoutForm({ planId, userId }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const cpf = formData.get('cpf') as string;
    const phone = formData.get('phone') as string;

    startTransition(async () => {
      const result = await subscribeToPlanAction({
        planId,
        userId,
        cpf,
        phone,
      });

      if (!result.success) {
        setErrorMessage(result.error ?? 'An unexpected error occurred.');
      } else {
        // Redirect or refresh upon success
        router.push('/dashboard');
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">
        Can you confirm that is the plan you want to subscribe to?
      </h3>

      {errorMessage && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
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
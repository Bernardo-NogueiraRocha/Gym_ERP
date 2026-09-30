import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CheckoutForm } from '@/components/plans/checkout-form';
import { redirect } from 'next/navigation';

export default async function CheckoutPage({params,}: {params: Promise<{ planId: string }>;}) {
  const { planId } = await params;

  // Get active session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect route: Redirect to sign-in if unauthenticated
  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-10">
      <CheckoutForm planId={planId} userId={session.user.id} />
    </div>
  );
}
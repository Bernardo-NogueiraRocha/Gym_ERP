import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { CheckoutForm } from '@/components/plans/checkout-form';
import { redirect } from 'next/navigation';
import { getUserData } from '@/lib/queries/user';
import { getStudentData } from '@/lib/queries/students';

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

  const userData = await getUserData(session.user.id);

  if (!userData || userData.role !== 'student') {
    redirect('/');
  }

  const studentData = await getStudentData(session.user.id);

  if (!studentData) {
    redirect('/complete-registration');
  }

  return (
    <div className="container mx-auto py-10">
      <CheckoutForm planId={planId} />
    </div>
  );
}

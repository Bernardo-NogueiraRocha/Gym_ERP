import { redirect } from 'next/navigation';
import type { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';

import { CompleteRegistrationForm } from '@/components/auth/complete-registration-form';
import { getSession } from '@/lib/auth-server';
import { getProfessionalProfile } from '@/lib/queries/professionals';
import { getStudentData } from '@/lib/queries/students';
import { getUserData } from '@/lib/queries/user';

export const metadata: Metadata = {
  title: 'Complete Registration | GYM_ERP',
  description: 'Finish setting up your GYM_ERP account.',
};

export const dynamic = 'force-dynamic';

export default async function CompleteRegistrationPage() {
  const session = await getSession().catch(() => null);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect('/sign-in');
  }

  if (userData.role === 'admin') {
    redirect('/');
  }

  const [studentData, professionalData] = await Promise.all([
    getStudentData(session.user.id),
    getProfessionalProfile(session.user.id),
  ]);

  // A completed profile should never see this page again.
  if (studentData) redirect('/plans');
  if (professionalData) redirect('/');

  return (
    <CompleteRegistrationForm
      name={userData.name}
      email={userData.email}
      initialRole={userData.role === 'professional' ? 'professional' : 'student'}
    />
  );
}

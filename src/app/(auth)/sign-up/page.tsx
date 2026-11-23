import { SignUpForm } from '@/components/auth/sign-up-form';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { getOptionalGoogleEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const googleEnabled = Boolean(getOptionalGoogleEnv());

  return (
    <SignUpForm
      googleEnabled={googleEnabled}
      initialError={getAuthErrorMessage(params.error)}
    />
  );
}

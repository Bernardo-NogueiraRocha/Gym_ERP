import { SignInForm } from '@/components/auth/sign-in-form';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { getOptionalGoogleEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const googleEnabled = Boolean(getOptionalGoogleEnv());

  return (
    <SignInForm
      googleEnabled={googleEnabled}
      initialError={getAuthErrorMessage(params.error)}
    />
  );
}

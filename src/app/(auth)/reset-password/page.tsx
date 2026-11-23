'use client';

import { Suspense, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setMessage('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      setMessage(error.message ?? 'Unable to reset password.');
    } else {
      router.push('/sign-in');
    }

    setLoading(false);
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-xl font-semibold text-foreground'>Reset password</h1>
        <p className='mt-1 text-xs text-muted-foreground'>Please enter the new password and confirm it.</p>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="New password"
          required
          className='mb-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          placeholder="Confirm password"
          required
          className='mb-1 mt-3 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'
        />

        <Button type="submit" size="lg" className='mt-2 w-full' disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>

        {message && <p className="text-sm text-destructive">{message}</p>}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
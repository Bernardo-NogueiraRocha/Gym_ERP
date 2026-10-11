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
        <h1 className='text-xl font-semibold text-slate-100'>Reset password</h1>
        <p className='text-xs text-slate-400 mt-1'>Please enter the new password and confirm it.</p>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="New password"
          required
          className='block font-medium text-slate-100 mb-1'
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          placeholder="Confirm password"
          required
          className='block font-medium text-slate-100 mb-1 mt-3'
        />

        <Button type="submit" disabled={loading} className='w-full hover:bg-blue-500 bg-blue-400 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2'>
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-center text-sm p-4">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
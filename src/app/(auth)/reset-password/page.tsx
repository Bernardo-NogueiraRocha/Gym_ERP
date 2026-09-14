'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
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
    <form onSubmit={handleSubmit}>
      <h1>Reset password</h1>

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="New password"
        required
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(event.target.value)
        }
        placeholder="Confirm password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset password'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage('');

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message ?? 'Something went wrong.');
    } else {
      setMessage(
        'If an account exists, a reset link has been sent.'
      );
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Forgot password?</h1>

      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send reset link'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
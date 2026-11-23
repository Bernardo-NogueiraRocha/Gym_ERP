'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

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
      // Generic on purpose: never reveal whether an email is registered.
      setMessage('If an account exists for that email, a password reset link has been sent.');
    }

    setLoading(false);
  }

  return (
    <div>
      <div>
        <h1 className='text-xl font-semibold text-foreground'>
          Forgot your password?
        </h1>
        <p className='mb-5 text-xs text-muted-foreground'>
          Please enter your email, and we will send you a password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
        />

        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Send reset link'}
        </Button>

        {message && <p className="mt-2 text-xs text-foreground">{message}</p>}
      </form>
    </div>
  );
}
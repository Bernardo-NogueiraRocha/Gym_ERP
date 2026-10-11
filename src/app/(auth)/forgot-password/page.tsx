'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { checkEmailAndReset } from '@/app/actions/forgot-password/actions';

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

    const check = await checkEmailAndReset(email);

    if (!check.success) {
      setMessage(check.message);
      setLoading(false);
      return;
    }

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message ?? 'Something went wrong.');
    } else {
      setMessage('A password reset link has been sent to your email.');
    }

    setLoading(false);
  }

  return (
    <div>
      <div>
        <h1 className='text-slate-100 text-xl font-semibold'>
          Forgot your password?
        </h1>
        <p className='mb-5 text-slate-400 text-xs'>
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
          className="w-full p-2 rounded-md bg-slate-800 text-slate-100 border border-slate-700 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className='w-full hover:bg-blue-500 bg-blue-400 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2'
        >
          {loading ? 'Checking...' : 'Send reset link'}
        </button>

        {message && <p className="text-xs text-slate-300 mt-2">{message}</p>}
      </form>
    </div>
  );
}
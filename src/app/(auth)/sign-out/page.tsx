'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function SignOutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Failed to sign out. Please try again.');
          setLoading(false);
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Goodbye</h2>
        <p className="text-xs text-slate-400 mt-1">
          Do you really want to sign out?
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSignOut} className="space-y-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </form>
    </div>
  );
}
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
        <h2 className="text-xl font-semibold text-foreground">Goodbye</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Do you really want to sign out?
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSignOut} className="space-y-4">
        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </form>
    </div>
  );
}
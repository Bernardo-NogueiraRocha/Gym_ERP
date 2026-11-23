'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { authClient } from '@/lib/auth-client';

type GoogleAccountLinkProps = {
  googleEnabled: boolean;
  googleLinked: boolean;
  initialError?: string | null;
};

export function GoogleAccountLink({
  googleEnabled,
  googleLinked,
  initialError = null,
}: GoogleAccountLinkProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  if (!googleEnabled) return null;

  async function handleLink() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { error: linkError } = await authClient.linkSocial({
        provider: 'google',
        callbackURL: '/account',
        errorCallbackURL: '/account',
      });

      if (linkError) {
        setError(getAuthErrorMessage(linkError.code ?? linkError.message));
        setLoading(false);
      }
    } catch {
      setError(getAuthErrorMessage('internal_server_error'));
      setLoading(false);
    }
  }

  return (
    <div className="mx-10 mt-5 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Google account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {googleLinked
              ? 'Google is connected. You can use it to sign in.'
              : 'Link Google to sign in without typing your password.'}
          </p>
        </div>

        {googleLinked ? (
          <span className="inline-flex items-center rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
            Connected
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleLink}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              aria-hidden="true"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {loading ? 'Redirecting...' : 'Link Google'}
          </Button>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';

type SignInFormProps = {
  googleEnabled: boolean;
  initialError?: string | null;
};

export function SignInForm({ googleEnabled, initialError = null }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    await signIn.email(
      {
        email,
        password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Invalid email or password.');
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="signin-email"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Email Address
          </label>
          <Input
            id="signin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="signin-password"
              className="block text-xs font-medium text-foreground"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="signin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        {googleEnabled && (
          <>
            <div className="relative py-1 text-center">
              <span className="relative z-10 bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
              <span className="absolute inset-x-0 top-1/2 border-t border-border" />
            </div>
            <GoogleAuthButton
              label="Continue with Google"
              errorCallbackURL="/sign-in"
              onError={setError}
              disabled={loading}
            />
          </>
        )}
      </form>

      {/* Sign-Up Navigation Link */}
      <div className="border-t border-border pt-2 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-primary hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}

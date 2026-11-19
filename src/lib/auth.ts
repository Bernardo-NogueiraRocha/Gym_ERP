// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { Resend } from 'resend';

import { getDb } from '@/db';
import * as schema from '@/db/schema';
import { getEmailEnv, getServerEnv } from '@/lib/env';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const env = getServerEnv();

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(getDb(), {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),

  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,

    async sendResetPassword({ user, url }) {
      const { RESEND_API_KEY, EMAIL_FROM } = getEmailEnv();
      const resend = new Resend(RESEND_API_KEY);

      // `onboarding@resend.dev` is Resend's test sender and only delivers to
      // the account owner. Set EMAIL_FROM to an address on a verified domain
      // in every real environment.
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Reset your password',
        html: `
          <p>Hello ${escapeHtml(user.name || 'there')},</p>
          <p>Someone requested a password reset for your account. If this was you, click the link below to reset your password:</p>
          <a href="${escapeHtml(url)}">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });

      if (error) {
        // Never log `url`: it contains the reset token.
        throw new Error(
          `Failed to send password reset email: ${error.name ?? 'unknown error'}`,
        );
      }
    },
  },

  plugins: [
    nextCookies(),
  ],
});

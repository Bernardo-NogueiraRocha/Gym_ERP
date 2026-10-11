// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { Resend } from 'resend';

import { getDb } from '@/db';
import * as schema from '@/db/schema';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
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
      await resend.emails.send({
        // During development/testing before verifying a custom domain, 
        // Resend requires sending from 'onboarding@resend.dev' to your own account email.
        from: 'onboarding@resend.dev', 
        to: user.email,
        subject: 'Reset your password',
        html: `
          <p>Hello ${user.name || 'there'},</p>
          <p>Someone requested a password reset for your account. If this was you, click the link below to reset your password:</p>
          <a href="${url}">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    },
  },

  plugins: [
    nextCookies(),
  ],
});
import { z } from 'zod';

/**
 * Server-only configuration.
 *
 * Validation is lazy so that a missing variable fails where it is actually
 * needed (a request, a script) instead of while a module is being imported.
 * Keeping this lazy also lets `next build` succeed on machines/CI without
 * production credentials for routes that are never rendered at build time.
 */
const coreEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required (PostgreSQL connection string).'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, 'BETTER_AUTH_SECRET is required (use a long random string).'),
  BETTER_AUTH_URL: z
    .string()
    .min(1, 'BETTER_AUTH_URL is required (for example http://localhost:3000).'),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_APP_URL is required (for example http://localhost:3000).'),
});

const emailEnvSchema = z.object({
  RESEND_API_KEY: z
    .string()
    .min(1, 'RESEND_API_KEY is required to send transactional emails.'),
  EMAIL_FROM: z
    .string()
    .min(1, 'EMAIL_FROM is required (for example "Gym ERP <no-reply@example.com>").')
    .default('onboarding@resend.dev'),
});

export type ServerEnv = z.infer<typeof coreEnvSchema>;
export type EmailEnv = z.infer<typeof emailEnvSchema>;

let cachedCore: ServerEnv | null = null;
let cachedEmail: EmailEnv | null = null;

function formatIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join(' ');
}

export function getServerEnv(): ServerEnv {
  if (cachedCore) return cachedCore;

  const parsed = coreEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid server environment configuration. ${formatIssues(parsed.error)}`,
    );
  }

  cachedCore = parsed.data;
  return cachedCore;
}

export function getEmailEnv(): EmailEnv {
  if (cachedEmail) return cachedEmail;

  const parsed = emailEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid email environment configuration. ${formatIssues(parsed.error)}`,
    );
  }

  cachedEmail = parsed.data;
  return cachedEmail;
}

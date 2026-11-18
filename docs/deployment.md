# Deployment

This document covers deploying Gym ERP (Next.js on Vercel + PostgreSQL on
Supabase) and the checks that must pass before real users are allowed in.

## Required environment variables

Copy `.env.example` and set every value per environment (Production and
Preview) in the Vercel project settings.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. On Supabase use the transaction pooler (port `6543`); the client already sets `prepare: false` and `max: 1`. |
| `BETTER_AUTH_SECRET` | Yes | Long random string (`openssl rand -base64 32`). Rotating it signs everyone out. |
| `BETTER_AUTH_URL` | Yes | Full origin of the deployment, for example `https://gym.example.com`. |
| `NEXT_PUBLIC_APP_URL` | Yes | Same origin, exposed to the browser. |
| `RESEND_API_KEY` | Yes | Required for password reset emails; sign-in does not depend on it. |
| `EMAIL_FROM` | Yes | Address on a domain verified in Resend, for example `Gym ERP <no-reply@example.com>`. `onboarding@resend.dev` only delivers to the Resend account owner. |
| `SEED_DEFAULT_PASSWORD` | No | Password for development seed accounts. Never set it in production. |

The application validates these lazily: a missing variable produces a clear
error the first time the related feature is used, instead of a silent failure.

## Database

The app connects directly to PostgreSQL with Drizzle ORM. Better Auth also uses
that database connection; **Supabase Auth and its RLS policies are not in use**.
Consequences:

- Row Level Security on `auth.*` does not protect application tables.
- Keep `DATABASE_URL` and any Supabase service-role key server-side only.
- Do not enable the Supabase REST/GraphQL API for these tables unless RLS is
  configured deliberately.
- Verify the database role used by the app has only the privileges it needs.

### Apply the schema

```bash
npm run db:generate   # optional, if you keep migration files
npm run db:push       # applies src/db/schema to the configured database
```

The `memberships` table has a partial unique index
(`memberships_one_live_per_student`) enforcing at most one `pending` or
`active` membership per student. Before pushing it to a database that already
has data, check for conflicts:

```sql
select student_id, count(*)
from memberships
where status in ('pending', 'active')
group by student_id
having count(*) > 1;
```

Resolve any rows before applying the index, otherwise `db:push` will fail.

### Seed data

- `npm run db:init` — **safe in production.** Inserts missing reference data
  (plans, features, muscles, exercises and their stimulus links) and never
  deletes or updates existing rows.
- `npm run db:seed` — **destructive.** Deletes every row in the database and
  inserts development fixtures. It refuses to run with `NODE_ENV=production`
  and additionally requires `ALLOW_DESTRUCTIVE_SEED=1`. Never point it at the
  production database.

## First deployment

1. Create the Vercel project and set the environment variables above for
   Production **and** Preview.
2. Provision the Supabase database and copy the transaction-pooler connection
   string into `DATABASE_URL`.
3. Apply the schema (`npm run db:push` locally against the production database,
   or a controlled migration job).
4. Run `npm run db:init` once to create the plan/feature/exercise catalog.
5. Deploy. Open the deployment URL and run the smoke tests below.
6. Create the first administrator deliberately (see below); public sign-up only
   creates students.

## Email (Resend)

1. Add and verify the sending domain in Resend (SPF and DKIM records).
2. Set `EMAIL_FROM` to an address on that domain.
3. Request a password reset for a real mailbox and confirm delivery. The
   application now surfaces Resend errors instead of reporting success, so a
   failed send appears as an error to the user.

## Administrator accounts

Public registration creates students only (`role` defaults to `student`). To
create the first administrator, promote an existing account manually:

```sql
update "user" set role = 'admin' where email = 'you@example.com';
```

Do not add self-service administrator registration.

## Post-deploy smoke tests

- [ ] Sign up with a blank phone number; the account is created and `phone` is `NULL`.
- [ ] Sign up with an existing CPF; see a field error and no orphaned `user` row.
- [ ] Sign in and out; the session cookie is set and cleared.
- [ ] Request a password reset for a real mailbox; the email arrives.
- [ ] Subscribe to a plan once; the membership is `pending` with one payment per installment.
- [ ] Subscribe again; the request is rejected as a duplicate.
- [ ] Submit a workout request; the row belongs to the signed-in student.
- [ ] As a professional, register a workout only for an assigned student.
- [ ] `curl https://<deployment>/api/students` returns `404` (the route was removed).
- [ ] Check that no request/console output contains passwords, tokens, CPF, or phone numbers.

## Logs and sensitive data

- Never log parsed form data, sessions, or `error.message` from database
  drivers: they can include SQL parameters (CPF, phone) or session tokens.
- If a deployment ever logged those values, review who could read the logs and
  rotate `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, and the database password.

## Rollback

- Vercel keeps previous deployments; promote the last known-good one.
- Schema changes should be backward compatible for one deploy cycle so an
  application rollback does not require a database rollback.

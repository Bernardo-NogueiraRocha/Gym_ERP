# Changelog

Notable changes to Gym ERP are documented here. This file follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security

- Removed debug logging that exposed passwords, session tokens, and personal data.
- Removed the unauthenticated `/api/students` endpoint.
- Server actions now derive student identity from the session instead of trusting client-supplied IDs.
- Registration failures roll back the auth user so no orphaned accounts remain.
- Added a partial unique index enforcing one live membership per student.
- Professionals can only prescribe workouts for students assigned to them.

### Fixed

- Blank optional phone numbers no longer block registration; field-level errors are shown on the sign-up form.
- Password reset emails use `EMAIL_FROM`, surface Resend failures, and escape user names.
- Checkout creates the membership and its payments in a single transaction and rejects duplicates.
- Workout requests validate input, require injury details when injuries are reported, and reject duplicate open requests.
- Billing date math is timezone-safe and clamps month-end dates correctly.

### Added

- Server environment validation (`src/lib/env.ts`) and a committed `.env.example`.
- Non-destructive `db:init` for production reference data, plus a destructive-seed guard.
- Deployment documentation in `docs/deployment.md`.
- Unit tests for date helpers and validation schemas (`npm test`).

### Changed

- `npm run db:seed` now requires `ALLOW_DESTRUCTIVE_SEED=1` and refuses to run with `NODE_ENV=production`.

## [0.1.12] - 2026-11-17

### Added

- Attend Workout pipeline
  - Stimulus visualizer with react-body-highlighter
  - Server action for finishing workout
- Updated Student dashboard
  - Workout Sessions cards
  - Calendar with days in which there was a registered workout session


## [0.1.11] - 2026-11-04

### Added

- Student workout request flow, including its schema, server action, and form.

## [0.1.10] - 2026-11-01

### Added

- Account page with membership information and payment statuses.
- Automatic payment records and due dates when creating a membership.

## [0.1.9] - 2026-10-08

### Added

- Workout registration form with exercise selection.
- Initial workout-session schema for recording performed exercises, repetitions, and weights.

## [0.1.8] - 2026-10-08

### Added

- Initial account and workout-registration page definitions.
- Student dashboard with current workouts and workout details.

## [0.1.7] - 2026-09-30

### Added

- Plans page and membership creation server action.
- Proxy configuration for route access and session handling.

### Changed

- Refactored naming and addressed lint warnings.

## [0.1.6] - 2026-09-18

### Added

- Sign-out flow that revokes the user session and redirects to sign-in.
- Session-management configuration.

## [0.1.5] - 2026-09-15

### Added

- Database seeding script with user and account records.

## [0.1.4] - 2026-09-14

### Added

- Authentication server actions and initial sign-up and sign-in pages.
- Forgot-password and reset-password pages.
- Proxy-based cookie management and access restrictions for dashboard routes.
- Roboto font configuration.

## [0.1.3] - 2026-09-11

### Added

- shadcn/ui setup.
- Better Auth configuration and catch-all authentication API route.

## [0.1.2] - 2026-09-10

### Added

- Docker Compose configuration for PostgreSQL.
- Database connection test script and Drizzle configuration.

## [0.1.1] - 2026-09-09

### Added

- Database schema definitions for the remaining entities in the project model.

## [0.1.0] - 2026-09-09

### Added

- Initial PostgreSQL and Drizzle ORM configuration.
- Base schema for students, plans, and the student-plan relationship.

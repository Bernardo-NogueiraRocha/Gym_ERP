# Changelog

Notable changes to Gym ERP are documented here. This file follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

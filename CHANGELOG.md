# Changelog

All notable changes to the Gym_ERP project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-09-09

### Added
- Initialized PostgreSQL database configuration using Drizzle ORM.
- Added base schema definition for `students`, `plans`, and `student_plan` junction tables.

## [0.1.1] - 2026-09-09
- Base schemas for all remaining classes in database model in docs folder.

## [0.1.2] - 2026-09-10
- Docker compose for postgres image: Simple setup with `docker compose up -d` for new installations.
- Test connection script in src/db/test-conn.ts
- Drizzle configuration files (image of Drizzle Studio with the table schemas added in media folder)

## [0.1.3] - 2026-09-11
- Shadcn installation
- Auth configuration with Better Auth: Catch-all routes with src/app/api/auth/[...all], so that API calls for authentication can be handled dynamically and managed by src/app/lib/auth.ts.


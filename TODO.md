# Project Roadmap & Task Backlog

## Core Database & Auth
- [X] Define remaining tables (financial ledger, exercises, workouts, audits)
- [X] Verify local database connectivity and run initial migration via Drizzle Kit
- [X] Setup Better Auth
- [X] Setup shadcn-ui

## Backend
- [X] Containerized PostgreSQL via Docker Compose
- [X] Database connection & environment configuration
- [X] Drizzle ORM setup & schema definitions (`src/db/schema.ts`)
- [X] Split database schema into modular files (Single Responsibility Principle)
- [X] Refactor DB environment module import (handling FS & env safely)
- [X] Better Auth integration with Drizzle adapter & PostgreSQL
- [X] CRUD Better Auth Users
- [X] Sign-up flow & Server Actions
- [X] Sign-in flow & session handling
- [X] Sign-out flow & cookies clearing
- [ ] Forgot Password workflow
- [ ] Delete Account (with cascade deletion of student profile & history)
- [ ] Account page (membership details, status, billing history)
- [ ] Onboarding flow (routing user to student, professional, or admin dashboards)

## Memberships & Plans
- [X] Plans page (displaying monthly, quarterly, semiannual, annual plans)
- [X] Membership checkout & subscription Server Action (`subscribeToPlanAction`)
- [ ] Stripe integration for automated recurring subscription payments
- [ ] Stripe Webhook handler (`checkout.session.completed`, `invoice.payment_failed`)

## Workout Execution & Tracking Module (`/dashboard/attend-workout/[workoutId]`)
- [X] Database schema design for workout templates (`workouts`, `workoutItems`)
- [ ] Database schema implementation for live execution logs (`workoutSessions`, `workoutSessionSets`)
- [ ] Attend workout page (`/dashboard/attend-workout/[workoutId]`)
- [ ] Live session state management (tracking completed sets, actual weight, and reps)
- [ ] Progress bar / checklist within active workout view
- [ ] Interactive Rest Timer component (countdown animation, pause, +30s adjustments)
- [ ] Dynamic ad-hoc exercise insertion (adding extra cardio, abs, or custom exercises mid-session)

## Professional & Student Workflow (Advanced / Future)
- [ ] Student intake form (goals, experience level, past/current injuries)
- [ ] Workout request system for students to submit preferences to professionals
- [ ] Professional dashboard to view student requests, preferences, and injury notes
- [ ] Professional workout builder interface (assigning/updating templates)
- [ ] Progress analytics & tracking (visualizing weight/volume increases over time via charts)
- [ ] Attendance calendar view (highlighting active workout session days in blue)

## Financial & Admin Dashboards
- [X] Script for seeding database (`src/db/seed.ts` with Better Auth users and mock ERP data)
- [ ] Financial metrics aggregation (MRR, total active students, churn rate)
- [ ] Input cash flow / accounts receivable tracking (`payments`)
- [ ] Cash expenditures / accounts payable tracking (`expenseBills`)
- [ ] Dashboard counters (active plans count, pending payments count)

## Code Quality & Architecture
- [ ] Clean Code practices & consistent architecture patterns
- [ ] Standardized naming conventions across components, actions, and schemas

## Priority Bug Fixes & Refactoring
- [ ] Fix non-atomic registration and raw error handling in `registerStudentAction`
- [ ] Refactor duplicate dashboard routes/components
- [ ] Fix broken page props across Server/Client component boundaries
- [ ] Clean up proxy and middleware routing logic
- [ ] Robust date logic handling (fixing UTC timezone shifts in `addFrequencyToDate`)
- [ ] Resolve naming inconsistencies (e.g., memberships vs student_plan nomenclature)
- [ ] Separate Sign-up flow specifically for Professionals (CREF validation)

## Input Validation & Sanitization
- [X] Input validation with Zod
- [X] CPF cleaning & sanitization (removing punctuation)
- [X] Phone number formatting
- [X] Email format verification
- [X] Name validation

## Testing Suite
- [ ] **Unit Testing (Vitest)**
  - [ ] Test date utility functions (`addFrequencyToDate`)
  - [ ] Test Zod validation schemas
- [ ] **Integration Testing**
  - [ ] Database CRUD operations
  - [ ] Constraint checks (inserting a user with a duplicate CPF)
  - [ ] Cascade deletion checks (deleting a student deletes their memberships)
- [ ] **Component Testing (React Testing Library)**
  - [ ] Rest timer interactive component tests
  - [ ] Checkout form submission states
- [ ] **End-to-End Testing (Playwright)**
  - [ ] Full authentication flow (Sign-in -> Dashboard redirection)
  - [ ] Membership subscription flow
- [ ] **Performance testing**
  - [ ] Requests per second
  - [ ] Users per second
  - [ ] Memory, CPU, IO usage

## Security
- [ ] XSS prevention & output sanitization
- [ ] SQL injection hardening via Drizzle ORM parameterized queries
- [ ] Role-Based Access Control (RBAC) verification on sensitive Server Actions

## Frontend
- [X] Implement Sign-Up page (`/sign-up`)
- [X] Implement Sign-In page (`/sign-in`)
- [X] Create Student Dashboard (`/dashboard` for student role)
- [ ] Create Admin Dashboard (`/dashboard` for admin role)
- [ ] Create Professional Dashboard (`/dashboard` for professional role)
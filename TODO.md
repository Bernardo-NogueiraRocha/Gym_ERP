# Project Roadmap & Task Backlog

## Phase 1: Core Database & Auth
- [X] Define remaining tables (financial ledger, exercises, workouts, audits)
- [X] Verify local database connectivity and run initial migration via Drizzle Kit
- [X] Setup Better Auth
- [X] Setup shadcn-ui

## Phase 2: Backend
- [X] CRUD Better auth Users
    - [X] Sign-up
    - [X] Sign-in
    - [X] Sign-out
    - [ ] Forgot Password ()
    - [ ] Delete Account
    - [X] Plans page
    - [X] Membership checkout
    - [ ] Onboarding (user to student/professional/admin)
- [X] Script for seeding database
- [ ] Financial metrics
    - [ ] Input cash flow
    - [ ] Cash expenditures
    - [ ] Number of active plans
    - [ ] Number of pending plan payments
- [ ] Clean Code practices
    - [ ] Naming conventions
    - [X] Separate database schema into a folder, because it does not follow the single responsability rule.
    - [X] Refactor db env module import due to touching the file system and environment.

- [ ] Corrections (priority)
    - [ ] Non-atomic registration and raw error on registerStudentAction
    - [ ] Duplicate dashboards
    - [ ] Broken page props
    - [ ] Proxy logic
    - [ ] Date logic
    - [ ] Naming inconsistencies
    - [ ] Separate Sign-up for Professionals

- [X] Input validation (Zod)
  - [X] CPF
  - [X] Phone
  - [x] Email
  - [x] Name

- [ ] Testing
  - [ ] Unit testing (Vitest)
    - [ ] addFrequencyToDate

  - [ ] Integration tests
    - [ ] Database
      - [ ] Insert a user with duplicate CPF
      - [ ] Delete student cascade memberships

  - [ ] Component testing

  - [ ] Security
    - [ ] XSS
    - [ ] SQL injection

## Phase 3: Frontend
- [X] Implement Sign-Up page (`/sign-up`)
- [X] Implement Sign-In page (`/sign-in`)
- [ ] Create Student Dashboard (`/dashboard` for student role)
- [ ] Create Admin Dashboard (`/dashboard` for admin role)
- [ ] Create Professional Dashboard (`/dashboard` for professional role)
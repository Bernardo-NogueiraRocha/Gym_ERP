# Project Roadmap & Task Backlog

## Phase 1: Core Database & Auth
- [X] Define remaining tables (financial ledger, exercises, workouts, audits)
- [X] Verify local database connectivity and run initial migration via Drizzle Kit
- [X] Setup Better Auth
- [X] Setup shadcn-ui
- [ ] Clean Code practices
    - [ ] Naming conventions
    - [ ] Separate database schema into a folder, because it does not follow the single responsability rule.
    - [ ] Refactor db env module import due to touching the file system and environment.
- [ ] Implement Sign-Up page (`/sign-up`)
- [ ] Implement Sign-In page (`/sign-in`)
 
## Phase 2: Role Dashboards
- [ ] Create Student Dashboard (`/dashboard` for student role)
- [ ] Create Admin Dashboard (`/dashboard` for admin role)
- [ ] Create Professional Dashboard (`/dashboard` for professional role)
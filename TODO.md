# TODO

Current backlog for Gym ERP. Items marked complete reflect functionality or infrastructure present in the repository; they do not imply that the feature has comprehensive tests or is production-ready.

## Authentication and onboarding

- [x] Better Auth integration with PostgreSQL and Drizzle.
- [x] Sign-up, sign-in, sign-out, session handling, and password recovery flows.
- [x] Complete onboarding and reliably route new users to the correct role workflow.
- [x] Define and enforce secure role assignment; prevent public registration as an administrator.
- [ ] Complete account deletion, including dependent profile and history cleanup.
- [x] Google OAuth for sign-up (redirects to complete registering) and login
- [x] Professional registration through Google plus an admin approval queue.

## Memberships and payments

- [x] Display available plans and provide a membership checkout flow.
- [x] Create membership records and generate payment records with due dates.
- [x] Show membership and payment information on the account page.
- [ ] Integrate a payment provider for recurring billing.
- [ ] Add and verify payment webhook handling, including successful and failed payments.
- [ ] Implement payment and expense tracking workflows and financial metrics. 

## Students, professionals, and workouts

- [x] Provide role-specific student, professional, and administrator dashboard components.
- [x] Let students submit workout requests and professionals view requests.
- [x] Provide a workout registration form for professionals.
- [x] Define workout and workout-item database schemas.
- [~] Finish workout assignment and editing workflows, including authorization for assigned students.
- [X] Implement workout-session logging for performed sets, repetitions, and weights.
- [X] Complete the attend-workout page and connect it to workout-session tracking.
- [ ] Add an exercise search mechanism in attend workout
- [ ] Add cardio based exercises (don't need reps or weight)
- [~] Add progress history and analytics for students and professionals.
- [ ] Add student intake information, including goals, experience, and injury history.
- [~] Improve dashboards with complete role-specific actions and operational metrics.

## Administration and operations

- [ ] Add student and professional registration and management workflows.
- [ ] Add class scheduling, enrollment, and attendance workflows.
- [ ] Add reports for memberships, payments, attendance, and business trends.
- [ ] Plan and document production deployment, backups, monitoring, and recovery.
- [ ] Add notifications and background jobs where needed.

## Quality and security

- [x] Add unit tests for date utilities and validation schemas.
- [ ] Add integration tests for database constraints and deletion behavior.
- [ ] Add component tests for interactive UI and checkout states.
- [ ] Add end-to-end tests for authentication, memberships, and workout flows.
- [ ] Verify role-based access control on protected pages, queries, and server actions.
- [ ] Review input/output handling, data privacy, and sensitive-data exposure.
- [~] Fix timezone-sensitive date calculations and add regression tests. Billing dates are fixed and tested; other date usages still need review.
- [x] Fix non-atomic student registration and return safe, consistent errors. Failures now remove the partial auth account.
- [ ] Consolidate duplicate routes/components and correct Server/Client component prop issues.
- [ ] Standardize naming and improve consistency across schemas, actions, and components.

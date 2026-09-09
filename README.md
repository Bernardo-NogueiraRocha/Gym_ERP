# GYM_ERP

ERP: Enterprise Resource Planning

## Requirements

* Students
    * Cadastration (photo, documents, address)
    * enrollment history
    * History of changes and observations
    * Situation (active, suspended, cancelled)
    * Payments
    * Times per week and classes
    * Workouts

* Plans
    * Mensal, quarterly, semiannual, annual
    * Enrollment, renovation, cancellement, freezing
    * Discount and promotions
    * Contract generation and control
    * Automatic expiration tracking

* Finance reports
    * Bills to pay and to be received
    * Cash flow;
        * Operating Cash Flow = Cash receipts from sales − Cash payments to suppliers, employees, and other operating expenses.
        * Free Cash Flow = Operating Cash Flow − Capital Expenditures (CapEx)
    * Income and expenses;
    * Delinquency management;
    * Financial reports;
    * Data export.

* Professionals
    * Hours
    * Student's workouts
* Administrators
    * Bills
* Exercises

Dashboards
Reports

Student's area

API


Audits
Database
Backups
Data protection: LGPD (General law of Data Protection - Brazil)
Documentation and organization

## Tech stack

Full-Stack Framework: NextJS (Typescript) - Unified code base for the student and admin portals, server components can handle finance queries in server.

Styling: Tailwind CSS + Shadcn/ui - Rapid development with Radix primitive (such as data tables, filters, forms).

Database: PostgreSQL (RDS)

ORM: Drizzle

Authentication: Better Auth

Background Jobs & Cron: Inngest

File Storage: AWS S3 + CloudFront

Validation & State: Zod + React Hook form for schema validation, in order to prevent corrupted enrollment or accounting inputs.

Deployment: AWS EC2 + RDS (for Postgres) + S3 (Storage)

## Pages
### User authentication and onboarding:
/sign-Up
/sign-In
/forgot-password
/onboarding

### Core ERP and Portals:
/dashboard (different views for each user type, such as student, professional, administrator)

### Student management:
/students
/students/new
/students/[student_id]
/students/[student_id]/workouts

### Workout and exercise library:
/workouts
/workout/[workout_id]
/exercises
/exercise/[exercise_id]
/exercises/new

### Plans and memberships:
/plans
/plans/new
/promotions

### Finance:
/finance/overview
/finance/receivables
/finance/payables
/finance/deliquency
/finance/reports

### Operations:
/professionals
/professionals/[professional_id]
/contracts/[contract_id]

### System administration:
/admin/audits
/admin/settings

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

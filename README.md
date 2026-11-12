# Gym ERP

Gym ERP is a web-based management system for fitness centers. It brings together member, professional, workout, membership, and payment workflows, with role-specific dashboards for administrators, professionals, and students.

## Features

### Authentication and Access Control
- User registration and sign-in.
- Session management and password recovery.
- Role-based access control.

### Gym Management
- Student and professional management.
- Membership plans.
- Class and schedule management.

### Workout Management
- Student workout requests.
- Professional workout registration and editing.

### Financial Management
- Membership checkout.
- Payment status tracking.
- Financial records and reporting.

> The application is under active development. Some workflows and dashboard capabilities are incomplete; see [TODO.md](TODO.md).

## Architecture Overview

Gym ERP uses a Next.js application with TypeScript
for its frontend and server-side functionality.

PostgreSQL provides persistent storage, with Drizzle ORM
handling database queries and schema management.

Better Auth manages authentication and session handling,
while application-level authorization controls access
according to user roles.

## Requirements

- Node.js and npm (or Bun).
- Docker and Docker Compose for the local PostgreSQL database, or for running the full Compose stack.

## Getting started

### Run the app locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root. Configure `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, and `RESEND_API_KEY` as needed. Keep real credentials private; do not commit `.env.local`.

3. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The project also supports Bun: use `bun install` and `bun run dev` instead of the npm commands.

### Run the full Compose stack

After configuring `.env.local` (required by the Compose app service), run:

```bash
docker compose up -d --build
```

This starts PostgreSQL and the containerized application on port 3000. To stop the services, run `docker compose down`. The database data is stored in the `postgres_data` Docker volume.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push the Drizzle schema to the configured database |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed the database with development data |

## Roles

| Role | Current focus |
| --- | --- |
| Administrator | Student and professional metrics, with administrative workflows in progress |
| Professional | View assigned students and register workouts |
| Student | View current workouts, request workouts, and access account and membership information |

## Technology

- Next.js and TypeScript
- React and Tailwind CSS, with shadcn/ui components
- PostgreSQL and Drizzle ORM
- Better Auth
- Zod for validation
- Docker Compose for local development

## Project documentation

- [TODO.md](TODO.md) — current backlog and project priorities
- [CHANGELOG.md](CHANGELOG.md) — notable project changes
- [`docs/`](docs/) — product, database, and system design notes

## License

No license has been specified yet.

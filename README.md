# Gym_ERP
## 1. Product Overview
Gym_ERP is a web-based management system designed to centralize the operational, financial, and student-management activities of fitness centers.

The system is organized around three main user roles: students, professionals, and administrators. Each role has access to the information and operations relevant to its responsibilities.


### Getting started
To start running, there are a few commands necessary:

1) 
```bash 
docker compose up -d
```
To have the database ready for the application.

2) npm (or bun) install
3) npm (or bun) run dev

## 2. Problem / Objective
### Problem

Fitness centers need to manage different aspects of their operations, including student records, training plans, classes, memberships, and financial information.

When these activities are not properly organized, it becomes harder to maintain consistent records, manage daily operations, and access information needed for decision-making.

### Objective

Gym_ERP aims to provide a centralized web-based platform for managing fitness center operations.

The system is designed to support student management, professional workflows, memberships, financial operations, and role-specific dashboards, allowing each user to access the information and functionality relevant to their responsibilities.

## 3. User Roles
| Resource   | Admin | Professional |      Student |
| --------- | ----: | -----------: | -----------: |
| Students  |  CRUD |        Read* |          Own |
| Workouts  |  CRUD |        CRUD* |     Read own |
| Exercises |  CRUD |         CRUD |         Read |
| Classes   |  CRUD | Read/manage* | Read/enroll* |
| Plans     |  CRUD |         Read |     Read own |
| Payments  |  CRUD |            - |     Read own |
| Reports   |  CRUD |      Limited |          Own |
| Users     |  CRUD |            - |          Own |


## 4. User Stories

### Students
1) As a student, I want to access my training plan so that I know which exercices I should perform.
2) As a student, I want to view my class schedule so that I can plan my training sessions.
3) As a student, I want to view my enrollment and payment status to that I can keep track of my membership.
4) As a student, I want to participate in other fitness classes, such as cycling and pilates. 
5) As a student, I want to be able to manage my plan and be notified of near future payments.

### Professionals
1) As a professional, I want to access the student assigned to me so that I can manage their training plans.
2) As a professional, I want to create and update workouts so that students can have an appropriate training plan.
3) As a professional, I want to view relevant student history so that I can make better decisions when adjusting workouts.
4) As a professional, I want to 

### Administrators
1) As a administrator, I want to manage students and professionals so that I can maintain the gym's records.
2) As a administrator, I want to manage plans and memberships so that I can control the commercial side of the gym.
3) As a administrator, I want to view financial information so that I can monitor the gym's operation.  
4) As a administrator, I want to access reports so that I can identify relevant trends in the business.

## 5. Functional Requirements
### Student Management
Requirements:
* Student registration 
  * Photo
  * Documents
  * Address
  * Enrollment history
  * Status: active, suspended, cancelled
  * Observations
  * Payment information

## 6. Non-Functional Requirements  
1) Authentication:
2) Authorization:
3) Data protection:
4) Auditability:
5) Database backups:  
6) API security:  
7) Availability:  
8) Data consistency: 
9) 

## 7. Current Status
### Implemented
* Authentication: Sign-up and sign-in pages with Better Auth. Authentication is integrated with the application database.
* Database: PostgreSQL running in a Docker container for local development.
* Persistence: Database schema defined and populated through a seeding script.
* ORM: Drizzle ORM integrated with the PostgreSQL database.
### In Progress
* Role-based authorization.
* User onboarding and role assignment.
* Role-specific dashboards.
* Student and professional workflows.
### Planned
* Financial management.
* Reports and data visualizations.
* AWS deployment.
* Background jobs and notifications.

## 8. Architecture


## 9. Tech Stack

| **Asppect**          | **Technology**           | **Rationale**                                                                  |
|----------------------|--------------------------|--------------------------------------------------------------------------------|
| Full Stack Framework | Next.js + TypeScript     | Unified application for the different user roles.                              |
| Styling              | Tailwind CSS + shadcn/ui | Build consistent interfaces and reusable UI components.                        |
| Database             | PostgreSQL               | Relational data model for users, students, workouts and other domain entities. |
| ORM                  | Drizzle                  | Type-safe database access and schema management.                               |
| Authentication       | Better Auth              | Manage authentication and user sessions.                                       |
| Local Environment    | Docker Compose           | Run PostgreSQL consistently in development.                                    |
### Planned Infrastructure

AWS EC2 — application deployment.

AWS RDS — managed PostgreSQL.

AWS S3 — file storage.

CloudFront — content delivery.

Inngest — background jobs and scheduled tasks.

## 10. Application Structure / Routes

## 11. Database

## 12. Security & LGPD

## 13. Roadmap
### MVP
* Main workflow:
1) Admin registers students and professionals
2) Professionals creates workouts and associates to a specific student
3) Student access their own workout and personal informations

* Authentication and onboarding
  * Sign-up
  * Sign-in
  * Sign-out
  * Persistent sessions
  * Password recovery
  * Initial onboarding
  * Role definition
* Rules:
  * Non-authenticated user does not access the system
  * Authenticated users have a defined role
  * User access only role defined features
  * Registering cannot allow any person to become an ADMIN.
**Current Status**:

* Users and authorization
* Student management
* Professional management
  * CRUD
  * Student link
  * Student consulting
  * Rules:
    * A professional can view and manage workouts only for students assigned to them.

* Exercises
  * Create
  * Edit/Update
  * List
  * Visualize
  * Delete
* Workouts
  * Create
  * Edit
  * Link to student
  * Add exercises
  * Define repetitions and sets
  * Student visualization
* Initial Dashboards:
  * Admin: Total of students, professionals, active students, shortcuts for registering.
  * Professional: Associated students, recent workouts, shortcuts for creating workouts, students without workouts.
  * Student: My workouts, current workout, personal information.

* **Out of scope**:
  * Financials;
  * Plans, promotions, renewals, freezing memberships.
  * Contracts, document generation;
  * Notifications and background jobs;
  * Advanced reports and visualizations;
  * Mobile app;
  * Public API for external integration;
  * AWS deploy;

### Planned production architecture
* Cloud based deployment in Cloud:AWS
  * AWS RDS for
  * AWS S3 for storage
  * CloudFront
  * EC2 for deployment of the website.

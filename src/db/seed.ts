import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { hashPassword } from 'better-auth/crypto';

import { getDb } from '@/db';
import * as schema from '@/db/schema';
import {
    exerciseData,
    featureData,
    muscleData,
    planData,
    planFeatureRules,
} from './reference-data';

const DEFAULT_DEV_PASSWORD = 'Password123!';

/**
 * This script DELETES every row before inserting fixtures. It must never run
 * against a production database: for production reference data use
 * `npm run db:init`, which is non-destructive.
 */
function assertDestructiveSeedIsAllowed() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error(
            'Refusing to run the destructive development seed with NODE_ENV=production. Use `npm run db:init` instead.',
        );
    }

    if (process.env.ALLOW_DESTRUCTIVE_SEED !== '1') {
        throw new Error(
            'Refusing to run the destructive development seed. Set ALLOW_DESTRUCTIVE_SEED=1 to confirm that all data will be deleted.',
        );
    }
}

function isoFrom(days: number, months = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
}

function daysAgo(days: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
}

async function main() {
    try {
        assertDestructiveSeedIsAllowed();

        const db = getDb();

        // 1. Clean existing records in reverse dependency order
        await db.delete(schema.classAttendances);
        await db.delete(schema.classSchedules);
        await db.delete(schema.workoutItems);
        await db.delete(schema.workouts);
        await db.delete(schema.payments);
        await db.delete(schema.memberships);
        await db.delete(schema.expenseBills);
        await db.delete(schema.classes);
        await db.delete(schema.exercises);
        await db.delete(schema.plans);
        await db.delete(schema.professionals);
        await db.delete(schema.students);
        await db.delete(schema.features);
        await db.delete(schema.planFeatures);
        await db.delete(schema.muscles);
        await db.delete(schema.exerciseMuscles);

        // Clean Better Auth core tables
        await db.delete(schema.account);
        await db.delete(schema.session);
        await db.delete(schema.verification);
        await db.delete(schema.user);

        // 2. Create Password Hash for Test Accounts
        const defaultPassword =
            process.env.SEED_DEFAULT_PASSWORD ?? DEFAULT_DEV_PASSWORD;

        const hashedPassword = await hashPassword(defaultPassword);

        // 3. Seed Users (Admins, Professionals, Students)
        const userRows = await db
            .insert(schema.user)
            .values([
                // Admin
                {
                    id: 'usr_admin_01',
                    name: 'Carlos Silva (Admin)',
                    email: 'admin@gym.com',
                    emailVerified: true,
                    role: 'admin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Professionals
                {
                    id: 'usr_prof_01',
                    name: 'Lucas Mendes',
                    email: 'lucas.mendes@gym.com',
                    emailVerified: true,
                    role: 'professional',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'usr_prof_02',
                    name: 'Camila Rocha',
                    email: 'camila.rocha@gym.com',
                    emailVerified: true,
                    role: 'professional',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'usr_prof_03',
                    name: 'Rodrigo Lima',
                    email: 'rodrigo.lima@gym.com',
                    emailVerified: true,
                    role: 'professional',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                // Students
                {
                    id: 'usr_stud_01',
                    name: 'Thiago Oliveira',
                    email: 'thiago.oliveira@gmail.com',
                    emailVerified: true,
                    role: 'student',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'usr_stud_02',
                    name: 'Anna Martins',
                    email: 'anna.martins@gmail.com',
                    emailVerified: true,
                    role: 'student',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'usr_stud_03',
                    name: 'Artur Santos',
                    email: 'artur.santos@gmail.com',
                    emailVerified: true,
                    role: 'student',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'usr_stud_04',
                    name: 'Helom Costa',
                    email: 'helom.costa@gmail.com',
                    emailVerified: true,
                    role: 'student',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'usr_stud_05',
                    name: 'Júlia Ferreira',
                    email: 'julia.ferreira@gmail.com',
                    emailVerified: true,
                    role: 'student',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ])
            .returning();

        // 4. Seed Better Auth Accounts (Credentials for Login)
        await db.insert(schema.account).values(
            userRows.map((u) => ({
                id: `acc_${u.id}`,
                userId: u.id,
                accountId: u.id,
                providerId: 'credential',
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            }))
        );

        // 5. Seed Core Domain Data
        const insertedMuscles = await db
            .insert(schema.muscles)
            .values(muscleData)
            .returning();

        // Create a lookup map for muscle slugs -> IDs
        const muscleMap = Object.fromEntries(insertedMuscles.map(m => [m.slug, m.id]));

        // 2. Seed Exercises (catalog from reference-data)
        const insertedExercises = await db
            .insert(schema.exercises)
            .values(exerciseData.map(({ name }) => ({ name })))
            .returning();

        // Create a lookup map for exercise names -> IDs
        const exerciseMap = Object.fromEntries(insertedExercises.map(e => [e.name, e.id]));

        // 3. Seed Junction Table (Exercise-Muscles with stimulus strengths)
        await db.insert(schema.exerciseMuscles).values(
            exerciseData.flatMap((exercise) =>
                exercise.muscles.map((muscle) => ({
                    exerciseId: exerciseMap[exercise.name],
                    muscleId: muscleMap[muscle.slug],
                    stimulusStrength: muscle.stimulusStrength,
                }))
            )
        );

        const planRows = await db
            .insert(schema.plans)
            .values(planData)
            .returning();

        const planByCycle = planRows.reduce<Record<string, (typeof planRows)[number]>>((acc, p) => {
            acc[p.billingCycle] = p;
            return acc;
        }, {});

        const featureRows = await db.insert(schema.features).values(featureData).returning();

        const featureByName = Object.fromEntries(featureRows.map((feature) => [feature.name, feature]));

        await db.insert(schema.planFeatures).values(
            planFeatureRules.flatMap((rule) => {
                const plan = planByCycle[rule.planCycle];
                const feature = featureByName[rule.featureName];
                if (!plan || !feature) return [];

                return [{
                    planId: plan.id,
                    featureId: feature.id,
                    included: rule.included,
                }];
            })
        );

        const classRows = await db
            .insert(schema.classes)
            .values([
                { name: 'Musculação', capacity: 30 },
                { name: 'Spinning', capacity: 20 },
                { name: 'Pilates', capacity: 15 },
                { name: 'CrossFit', capacity: 12 },
            ])
            .returning();

        // 6. Map Professionals to Better Auth Users
        const professionalRows = await db
            .insert(schema.professionals)
            .values([
                { userId: 'usr_prof_01', cref: '012345678/G-SP', specialty: 'Musculação e hipertrofia', approved: true },
                { userId: 'usr_prof_02', cref: '876543210/G-SP', specialty: 'CrossFit nível 2', approved: true },
                { userId: 'usr_prof_03', cref: '456789123/G-SP', specialty: 'Pilates e mobilidade', approved: true },
            ])
            .returning();

        // 7. Map Students to Better Auth Users
        const [thiago, anna, artur, helom, julia] = await db
            .insert(schema.students)
            .values([
                { userId: 'usr_stud_01', cpf: '11122233301', phone: '+55 11 91111-0001', status: 'active' },
                { userId: 'usr_stud_02', cpf: '11122233302', phone: '+55 11 91111-0002', status: 'active' },
                { userId: 'usr_stud_03', cpf: '11122233303', phone: '+55 11 91111-0003', status: 'active' },
                { userId: 'usr_stud_04', cpf: '11122233304', phone: '+55 11 91111-0004', status: 'suspended' },
                { userId: 'usr_stud_05', cpf: '11122233305', phone: '+55 11 91111-0005', status: 'active' },
            ])
            .returning();

        // 8. Seed Memberships & Payments
        const [thiagoM, annaM, arturM, helomM, juliaM, thiagoOldM] = await db
            .insert(schema.memberships)
            .values([
                { studentId: thiago.id, planId: planByCycle.mensal.id, startDate: isoFrom(-10), endDate: isoFrom(-10, 1), status: 'active' },
                { studentId: anna.id, planId: planByCycle.quarterly.id, startDate: isoFrom(-40), endDate: isoFrom(-40, 3), status: 'active' },
                { studentId: artur.id, planId: planByCycle.semiannual.id, startDate: isoFrom(-100), endDate: isoFrom(-100, 6), status: 'active' },
                { studentId: helom.id, planId: planByCycle.mensal.id, startDate: isoFrom(-35), endDate: isoFrom(-35, 1), status: 'expired' },
                { studentId: julia.id, planId: planByCycle.annual.id, startDate: isoFrom(0), endDate: isoFrom(0, 12), appliedDiscount: '80.00', status: 'pending' },
                { studentId: thiago.id, planId: planByCycle.mensal.id, startDate: isoFrom(-60), endDate: isoFrom(-60, 1), status: 'canceled' },
            ])
            .returning();

        await db.insert(schema.payments).values([
            { membershipId: thiagoM.id, amount: '120.00', dueDate: isoFrom(-10), paymentDate: isoFrom(-9), status: 'completed' },
            { membershipId: annaM.id, amount: '300.00', dueDate: isoFrom(-40), paymentDate: isoFrom(-38), status: 'completed' },
            { membershipId: arturM.id, amount: '540.00', dueDate: isoFrom(-100), paymentDate: isoFrom(-100), status: 'completed' },
            { membershipId: helomM.id, amount: '120.00', dueDate: isoFrom(-30), status: 'overdue' },
            { membershipId: juliaM.id, amount: '880.00', dueDate: isoFrom(3), status: 'pending' },
            { membershipId: thiagoOldM.id, amount: '120.00', dueDate: isoFrom(-55), status: 'overdue' },
        ]);

        // 9. Workouts & Items
        const workoutRows = await db
            .insert(schema.workouts)
            .values([
                { studentId: thiago.id, prescribedByProfessionalId: professionalRows[0].id, title: 'Hipertrofia - Full Body A', startDate: isoFrom(-10), endDate: isoFrom(50) },
                { studentId: thiago.id, prescribedByProfessionalId: professionalRows[0].id, title: 'Hipertrofia - Full Body B', startDate: isoFrom(-10), endDate: isoFrom(50) },
                { studentId: anna.id, prescribedByProfessionalId: professionalRows[1].id, title: 'CrossFit Condicionamento', startDate: isoFrom(-40), endDate: isoFrom(50) },
                { studentId: julia.id, prescribedByProfessionalId: professionalRows[2].id, title: 'Pilates Iniciante', startDate: isoFrom(0), endDate: isoFrom(90) },
            ])
            .returning();

        await getDb()
            .insert(schema.professionalStudents)
            .values(
                [
                    { professionalId: professionalRows[0].id, studentId: thiago.id },
                    { professionalId: professionalRows[1].id, studentId: anna.id },
                    { professionalId: professionalRows[2].id, studentId: julia.id },
                ]
            );

        const [thiagoA, thiagoB, annaW, juliaW] = workoutRows;
        await db.insert(schema.workoutItems).values([
            { workoutId: thiagoA.id, exerciseId: exerciseMap['Bench Press'], position: 0, sets: 4, reps: 10, restSeconds: 60 },
            { workoutId: thiagoA.id, exerciseId: exerciseMap['Lat Pulldown'], position: 1, sets: 3, reps: 12, restSeconds: 60 },
            { workoutId: thiagoA.id, exerciseId: exerciseMap['Leg Press'], position: 2, sets: 4, reps: 10, restSeconds: 90 },
            { workoutId: thiagoA.id, exerciseId: exerciseMap['Biceps Curl'], position: 3, sets: 3, reps: 12, restSeconds: 45 },
            { workoutId: thiagoB.id, exerciseId: exerciseMap['Deadlift'], position: 0, sets: 4, reps: 6, restSeconds: 120 },
            { workoutId: thiagoB.id, exerciseId: exerciseMap['Back Squat'], position: 1, sets: 4, reps: 8, restSeconds: 90 },
            { workoutId: thiagoB.id, exerciseId: exerciseMap['Shoulder Press'], position: 2, sets: 3, reps: 10, restSeconds: 60 },
            { workoutId: thiagoB.id, exerciseId: exerciseMap['Plank'], position: 3, sets: 3, reps: 60, restSeconds: 30 },
            { workoutId: annaW.id, exerciseId: exerciseMap['Back Squat'], position: 0, sets: 5, reps: 5, restSeconds: 120 },
            { workoutId: annaW.id, exerciseId: exerciseMap['Deadlift'], position: 1, sets: 3, reps: 5, restSeconds: 150 },
            { workoutId: annaW.id, exerciseId: exerciseMap['Shoulder Press'], position: 2, sets: 5, reps: 5, restSeconds: 90 },
            { workoutId: juliaW.id, exerciseId: exerciseMap['Plank'], position: 0, sets: 3, reps: 45, restSeconds: 30 },
            { workoutId: juliaW.id, exerciseId: exerciseMap['Leg Press'], position: 1, sets: 3, reps: 15, restSeconds: 45 },
        ]);

        // 10. Schedules & Attendances
        const scheduleRows = await db
            .insert(schema.classSchedules)
            .values([
                { classId: classRows[0].id, professionalId: professionalRows[0].id, startTime: '07:00:00', endTime: '08:00:00', dayWeek: 'monday' },
                { classId: classRows[0].id, professionalId: professionalRows[0].id, startTime: '07:00:00', endTime: '08:00:00', dayWeek: 'wednesday' },
                { classId: classRows[0].id, professionalId: professionalRows[0].id, startTime: '07:00:00', endTime: '08:00:00', dayWeek: 'friday' },
                { classId: classRows[1].id, professionalId: professionalRows[1].id, startTime: '19:00:00', endTime: '20:00:00', dayWeek: 'tuesday' },
                { classId: classRows[1].id, professionalId: professionalRows[1].id, startTime: '19:00:00', endTime: '20:00:00', dayWeek: 'thursday' },
                { classId: classRows[2].id, professionalId: professionalRows[2].id, startTime: '18:00:00', endTime: '19:00:00', dayWeek: 'monday' },
                { classId: classRows[2].id, professionalId: professionalRows[2].id, startTime: '10:00:00', endTime: '11:00:00', dayWeek: 'saturday' },
                { classId: classRows[3].id, professionalId: professionalRows[1].id, startTime: '20:00:00', endTime: '21:00:00', dayWeek: 'wednesday' },
                { classId: classRows[3].id, professionalId: professionalRows[1].id, startTime: '20:00:00', endTime: '21:00:00', dayWeek: 'friday' },
            ])
            .returning();

        await db.insert(schema.classAttendances).values([
            { scheduleId: scheduleRows[0].id, studentId: thiago.id, attendedAt: daysAgo(2) },
            { scheduleId: scheduleRows[1].id, studentId: thiago.id, attendedAt: daysAgo(4) },
            { scheduleId: scheduleRows[3].id, studentId: anna.id, attendedAt: daysAgo(3) },
            { scheduleId: scheduleRows[5].id, studentId: julia.id, attendedAt: daysAgo(6) },
            { scheduleId: scheduleRows[7].id, studentId: artur.id, attendedAt: daysAgo(2) },
        ]);

        // 11. Expenses
        await db.insert(schema.expenseBills).values([
            { category: 'rent', description: 'Aluguel do galpão da academia', amount: '2500.00', dueDate: isoFrom(10), type: 'fixed' },
            { category: 'salary', description: 'Folha de pagamento dos instrutores', amount: '8000.00', dueDate: isoFrom(5), type: 'fixed' },
            { category: 'machinery', description: 'Compra de duas bicicletas ergométricas', amount: '3600.00', dueDate: isoFrom(-20), paymentDate: isoFrom(-18), type: 'investment' },
            { category: 'supplies', description: 'Produtos de limpeza e suprimentos', amount: '450.00', dueDate: isoFrom(-3), paymentDate: isoFrom(-3), type: 'recurring' },
            { category: 'monthly', description: 'Energia elétrica e água', amount: '890.00', dueDate: isoFrom(8), type: 'fixed' },
        ]);

        console.log('Development database seeded successfully.');
        console.log('Test accounts: admin@gym.com, lucas.mendes@gym.com, thiago.oliveira@gmail.com, ...');
        console.log(
            `Password: ${process.env.SEED_DEFAULT_PASSWORD ? 'from SEED_DEFAULT_PASSWORD' : 'development default (set SEED_DEFAULT_PASSWORD to override)'}`,
        );
    } catch (error) {
        console.error(
            'Seeding failed:',
            error instanceof Error ? error.message : error,
        );
        process.exitCode = 1;
    } finally {
        process.exit();
    }
}

void main();

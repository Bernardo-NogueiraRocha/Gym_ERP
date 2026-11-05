import { getDb } from "@/db";
import { professionals,exercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WorkoutRegisterForm } from "@/components/register-workout/workout-register-form";
import { getSession } from "@/lib/auth-server";
import { AccessDenied } from "@/components/access-denied";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Workout | GYM_ERP',
  description: 'Create and assign custom workouts to students.',
};

async function getProfessionalData(userId: string) {
    try {
        const [professionalData] = await getDb()
            .select()
            .from(professionals)
            .where(eq(professionals.userId, userId))
            .limit(1);

        return professionalData ?? null;
    } catch (err) {
        console.error("Failed to fetch professional data:", err);
        return null;
    }
}

async function GetExerciseList() {
    const exercise_list = await getDb().select()
            .from(exercises)
    return exercise_list
}



export default async function RegisterWorkoutPage() {
    const session = await getSession();

    if (!session) {
        return (
            <AccessDenied message="You must be logged in to access this page." />
        );
    }

    const professionalData = await getProfessionalData(session.user.id);

    // If logged in, but not registered as a professional in the database:
    if (!professionalData) {
        return (
            <AccessDenied message="You must be a professional in order to access this page." />
        );
    }

    if (!professionalData.approved){
        return (
            <AccessDenied message="You must be an approved professional in order to access this page." />
        );
    }
    const exercise_list = await GetExerciseList();

    return (
        <div>
            <WorkoutRegisterForm exercises={exercise_list}/>
        </div>
    );
}

import { getDb } from "@/db";
import { professionals,exercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WorkoutRegisterForm } from "@/components/register-workout/workout-register-form";
import { getSession } from "@/lib/auth-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

function AccessDenied({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-red-950/40 border border-red-500/50 p-6 rounded-xl max-w-md shadow-lg">
                <h2 className="text-xl font-bold text-red-200 mb-2">Access Denied</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    {message}
                </p>
                <Button variant="default">
                    <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button variant="default">
                    <Link href="/sign-up">Sign up</Link>
                </Button>
            </div>
        </div>
    );
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

    const exercise_list = await GetExerciseList();

    return (
        <div>
            <WorkoutRegisterForm professional={professionalData} exercises={exercise_list}/>
        </div>
    );
}
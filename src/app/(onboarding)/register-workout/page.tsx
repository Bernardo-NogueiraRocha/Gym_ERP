import { getDb } from "@/db";
import { professionals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WorkoutRegisterForm } from "@/components/workout-register-form";
import { notFound, redirect } from "next/navigation";

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

export default async function RegisterWorkoutPage({
    params
}: {
    params: { userId: string }
}) {
    const professionalData = await getProfessionalData(params.userId);

    if (!professionalData) {
        redirect('/sign-in')
    }

    return (
        <div>
            <WorkoutRegisterForm professional={professionalData} />
        </div>
    );
}
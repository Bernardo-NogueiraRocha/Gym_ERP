import { getStudentData } from "@/lib/queries/students";
import { getSession } from "@/lib/auth-server";
import { AccessDenied } from "@/components/access-denied";
import { WorkoutRequestForm } from "@/components/request-workout/request-workout-form";

export default async function RequestWorkoutPage() {
    const session = await getSession();

    if (!session) {
        return (
            <AccessDenied message="You must be logged in to access this page." />
        );
    }

    const studentData = await getStudentData(session.user.id);

    if (!studentData) {
        return (
            <AccessDenied message="Only students can request a workout." />
        );
    }

    return <WorkoutRequestForm />;
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getStudentData } from "@/lib/queries/students";
import { AccessDenied } from "@/components/access-denied";
import { FormEvent } from "react";
import { WorkoutRequestForm } from "@/components/request-workout/request-workout-form";

export default async function RequestWorkoutPage() {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return (
            <AccessDenied message="You must be logged in to access this page." />
        );
    }

    const studentData = await getStudentData(session.user.id);

    if (studentData == null) {
        return (
            <div>

            </div>
        )
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

    }
    return (
        <WorkoutRequestForm studentId={studentData.studentId}/>
    )
}
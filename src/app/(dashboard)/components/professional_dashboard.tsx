import { Button } from "@/components/ui/button";
import { getDb } from "@/db";
import { user, professionals, students, professionalStudents } from '@/db/schema';
import { eq } from "drizzle-orm";
import Link from 'next/link'

async function getProfessionalData(userId: string) {
    const [professionalData] = await getDb()
        .select({
            name: user.name,
            email: user.email,
            professionalId: professionals.id,
            approved: professionals.approved,
        })
        .from(professionals)
        .innerJoin(user, eq(user.id, professionals.userId))
        .where(eq(professionals.userId, userId))
        .limit(1);

    return professionalData ?? null;
}

async function getAssignedStudents(professionalId: string) {
    return await getDb()
        .select({
            studentId: students.id,
            name: user.name,
            email: user.email,
        })
        .from(professionalStudents)
        .innerJoin(students, eq(professionalStudents.studentId, students.id))
        .innerJoin(user, eq(students.userId, user.id))
        .where(eq(professionalStudents.professionalId, professionalId));
}

function StudentList({ students }: { students: Awaited<ReturnType<typeof getAssignedStudents>> }) {
    if (students.length === 0) {
        return (
            <div className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                No students have been assigned to you yet.
            </div>
        );
    }

    return (
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
            {students.map((student, index) => (
                <li
                    key={student.studentId}
                    className="flex items-center justify-between p-3 text-sm text-foreground"
                >
                    <span className="font-medium">
                        {index + 1}. {student.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{student.email}</span>
                </li>
            ))}
        </ul>
    );
}

export async function ProfessionalDashboard({ userId }: { userId: string }) {
    const professionalData = await getProfessionalData(userId);

    if (!professionalData) {
        return (
            <div className="p-6 text-destructive">
                Professional profile not found.
            </div>
        );
    }

    if (!professionalData.approved) {
        return (
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-warning/50 bg-warning/10 p-8 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Registration awaiting approval
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    An administrator must review your professional registration
                    before you can access student workouts.
                </p>
            </div>
        );
    }

    const assignedStudents = await getAssignedStudents(professionalData.professionalId);

    return (
        <div className="space-y-6 p-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Hello Professional {professionalData.name}!
                </h1>
                <p className="text-sm text-muted-foreground">
                    Here is your active student roster.
                </p>
            </header>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                    Estudantes ({assignedStudents.length})
                </h2>

                <StudentList students={assignedStudents} />
            </section>
            <section>
                <h2 className="text-lg font-semibold text-foreground">Would You like to register a workout?</h2>
                <Link href='/register-workout'>
                    <Button>Register Workout</Button>
                </Link>
            </section>
        </div>
    );
}
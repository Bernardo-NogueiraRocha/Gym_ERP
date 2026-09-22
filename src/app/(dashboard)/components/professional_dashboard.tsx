import { getDb } from "@/db";
import { user, professionals, students, professionalStudents } from '@/db/schema';
import { eq } from "drizzle-orm";

async function getProfessionalData(userId: string) {
    const [professionalData] = await getDb()
        .select({
            name: user.name,
            email: user.email,
            professionalId: professionals.id,
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
            <div className="rounded-md bg-zinc-900 p-4 text-sm text-zinc-400">
                No students have been assigned to you yet.
            </div>
        );
    }

    return (
        <ul className="divide-y divide-zinc-800 rounded-md border border-zinc-800">
            {students.map((student, index) => (
                <li
                    key={student.studentId}
                    className="flex items-center justify-between p-3 text-sm text-zinc-200"
                >
                    <span className="font-medium">
                        {index + 1}. {student.name}
                    </span>
                    <span className="text-xs text-zinc-500">{student.email}</span>
                </li>
            ))}
        </ul>
    );
}

export async function ProfessionalDashboard({ userId }: { userId: string }) {
    const professionalData = await getProfessionalData(userId);

    if (!professionalData) {
        return (
            <div className="p-6 text-red-400">
                Professional profile not found.
            </div>
        );
    }

    const assignedStudents = await getAssignedStudents(professionalData.professionalId);

    return (
        <div className="space-y-6 p-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Hello Professional {professionalData.name}!
                </h1>
                <p className="text-sm text-zinc-400">
                    Here is your active student roster.
                </p>
            </header>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-zinc-100">
                    Estudantes ({assignedStudents.length})
                </h2>

                <StudentList students={assignedStudents} />
            </section>
        </div>
    );
}
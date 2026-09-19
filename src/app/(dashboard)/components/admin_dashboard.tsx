import { getDb } from "@/db";
import { user, students, professionals } from '@/db/schema'
import { count, eq } from "drizzle-orm";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

async function getTotalStudents() {
    const [result] = await getDb().select({ count: count() }).from(students);
    return result.count;
}

type StudentStatus = 'active' | 'suspended' | 'cancelled';

async function getStudentsByStatus(status: StudentStatus) {
    const [result] = await getDb().select({ count: count() })
        .from(students)
        .where(eq(students.status, status));
    return result.count;
}

async function getTotalProfessionals() {
    const [result] = await getDb().select({ count: count() }).from(professionals);
    return result.count;
}

export function ActionButtons() {
    return (
        <div className="grid grid-cols-2 gap-2">
            {/* First Button */}
            <Link href="/sign-up">
                <Button variant="link" className="text-white">
                    Register Student
                </Button>
            </Link>

            {/* Second Button */}
            <Link href="/sign-in">
                <Button variant="link" className="text-white">
                    Register Professional
                </Button>
            </Link>
        </div>
    );
}

// Receives an object that contains the column userId, so this will make JavaScript to take the object
// and extract only the property called userId into the local variable.
export async function AdminDashboard({ userId }: { userId: string }) {
    const [userData] = await getDb().select({ name: user.name }).from(user).where(eq(user.id, userId));
    const totalStudents = await getTotalStudents();
    const activeStudents = await getStudentsByStatus('active');
    const suspendedStudents = await getStudentsByStatus('suspended');
    const cancelledStudents = await getStudentsByStatus('cancelled');
    return (
        <div>
            <h1>Hello, User ID: {userData.name}</h1>
            <p>Total number of students: {totalStudents}</p>
            <p>Total number of active students: {activeStudents}</p>
            <p>Total number of suspended students: {suspendedStudents}</p>
            <p>Total number of cancelled students: {cancelledStudents}</p>
            <ActionButtons />
        </div>
    );
}
import { getDb } from "@/db";
import { user, students, professionals } from '@/db/schema'
import { count, eq, sql } from "drizzle-orm";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import AnalyticsChart from '@/components/admin-charts/example'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getTotalStudents() {
    const [result] = await getDb().select({ count: count() }).from(students);
    return result.count;
}

async function getActiveStudentsDates() {
    const result = await getDb()
        .select({
            date: sql<string>`DATE(${user.createdAt})`,
            total: count(),
        })
        .from(students)
        .innerJoin(user, eq(user.id, students.userId))
        .where(eq(students.status, 'active'))
        .groupBy(sql`DATE(${user.createdAt})`)
        .orderBy(sql`DATE(${user.createdAt})`);
    return result;
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
    const totalProfessionals = await getTotalProfessionals();
    const histogramActiveStudents = await getActiveStudentsDates();
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Active Students by Date</CardTitle>
                </CardHeader>
                <CardContent>
                    <AnalyticsChart data={histogramActiveStudents} />
                </CardContent>
            </Card>
            <h1>Hello, User ID: {userData.name}</h1>
            <p>Total number of students: {totalStudents}</p>
            <p>Total number of active students: {activeStudents}</p>
            <p>Total number of suspended students: {suspendedStudents}</p>
            <p>Total number of cancelled students: {cancelledStudents}</p>
            <p>Total number of professionals:{totalProfessionals}</p>
            <ActionButtons />
        </div>
    );
}
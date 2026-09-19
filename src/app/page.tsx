// app/(dashboard)/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { AdminDashboard } from "./(dashboard)/components/admin_dashboard";
import { StudentDashboard } from "./(dashboard)/components/student_dashboard";
import { ProfessionalDashboard } from "./(dashboard)/components/professional_dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });

  if (!session) {
    redirect('/sign-in');
  }

  const [userData] = await getDb()
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!userData) {
    redirect('/sign-in');
  }

  // Render dedicated component based on role
  switch (userData.role) {
    case 'admin':
      return <AdminDashboard userId={session.user.id} />;
    case 'professional':
      return <ProfessionalDashboard userId={session.user.id} />;
    case 'student':
    default:
      return <StudentDashboard userId={session.user.id} />;
  }
}
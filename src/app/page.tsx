import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminDashboard } from "./(dashboard)/components/admin_dashboard";
import { StudentDashboard } from "./(dashboard)/components/student_dashboard";
import { ProfessionalDashboard } from "./(dashboard)/components/professional_dashboard";
import {getUserData} from "@/lib/queries/user"

export const metadata: Metadata = {
  title: "Dashboard | GYM_ERP",
  description: "Dashboard for specific roles containing relevant data.",
};

export default async function DashboardPage() {
  let session;
  
  try {
    session = await auth.api.getSession({ 
      headers: await headers() 
    });
  } catch (error) {
    console.error("Failed to fetch session:", error);
    redirect('/sign-in');
  }

  if (!session || !session.user) {
    redirect('/sign-in');
  }

  const userData = await getUserData(session.user.id, {role: true, id: true});

  if (!userData){
    redirect('/sign-in');
  }
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
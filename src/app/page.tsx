import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminDashboard } from "./(dashboard)/components/admin_dashboard";
import { StudentDashboard } from "./(dashboard)/components/student_dashboard";
import { ProfessionalDashboard } from "./(dashboard)/components/professional_dashboard";
import { getUserData } from "@/lib/queries/user";
import { getStudentData } from "@/lib/queries/students";
import { getProfessionalProfile } from "@/lib/queries/professionals";

export const metadata: Metadata = {
  title: "Dashboard | GYM_ERP",
  description: "Dashboard for specific roles containing relevant data.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const requestHeaders = await headers();
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect("/sign-in");
  }

  if (userData.role === "student") {
    const studentData = await getStudentData(session.user.id);
    if (!studentData) redirect("/complete-registration");
  }

  if (userData.role === "professional") {
    const professionalData = await getProfessionalProfile(session.user.id);
    if (!professionalData) redirect("/complete-registration");
  }

  switch (userData.role) {
    case "admin":
      return <AdminDashboard userId={session.user.id} />;
    case "professional":
      return <ProfessionalDashboard userId={session.user.id} />;
    case "student":
    default:
      return <StudentDashboard userId={session.user.id} />;
  }
}
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/queries/user";

import { AdminAccount } from "@/components/account/admin-account";
import { ProfessionalAccount } from "@/components/account/professional-account";
import { StudentAccount } from "@/components/account/student-account";

import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';

export const metadata: Metadata = {
  title: 'Account | GYM_ERP',
  description: 'Account info GYM_ERP.',
};

export default async function AccountPage() {
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to fetch session:", error);
    redirect("/sign-in");
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect("/sign-in");
  }

  switch (userData.role) {
    case "admin":
      return <AdminAccount userData={userData} />;
    case "professional":
      return <ProfessionalAccount userData={userData} />;
    case "student":
    default:
      return <StudentAccount userData={userData} />;
  }
}
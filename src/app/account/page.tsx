import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserData, getLinkedAccountProviders } from "@/lib/queries/user";
import { getStudentData } from "@/lib/queries/students";
import { getProfessionalProfile } from "@/lib/queries/professionals";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { getOptionalGoogleEnv } from "@/lib/env";

import { AdminAccount } from "@/components/account/admin-account";
import { ProfessionalAccount } from "@/components/account/professional-account";
import { StudentAccount } from "@/components/account/student-account";
import { GoogleAccountLink } from "@/components/account/google-account-link";

import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';

export const metadata: Metadata = {
  title: 'Account | GYM_ERP',
  description: 'Account info GYM_ERP.',
};

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  let session;
  const requestHeaders = await headers();

  try {
    session = await auth.api.getSession({
      headers: requestHeaders,
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

  if (userData.role === "student") {
    const studentData = await getStudentData(session.user.id);
    if (!studentData) redirect("/complete-registration");
  }

  if (userData.role === "professional") {
    const professionalData = await getProfessionalProfile(session.user.id);
    if (!professionalData) redirect("/complete-registration");
  }

  const linkedProviders = await getLinkedAccountProviders(session.user.id);
  const googleEnabled = Boolean(getOptionalGoogleEnv());

  let accountContent;
  switch (userData.role) {
    case "admin":
      accountContent = <AdminAccount userData={userData} />;
      break;
    case "professional":
      accountContent = <ProfessionalAccount userData={userData} />;
      break;
    case "student":
    default:
      accountContent = <StudentAccount userData={userData} />;
      break;
  }

  return (
    <div>
      {accountContent}
      <GoogleAccountLink
        googleEnabled={googleEnabled}
        googleLinked={linkedProviders.includes("google")}
        initialError={getAuthErrorMessage(params.error)}
      />
    </div>
  );
}

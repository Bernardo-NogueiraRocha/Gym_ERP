import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { getStudentData } from '@/lib/queries/students'
import { redirect } from "next/navigation";
import {getUserData} from "@/lib/queries/user"

export default async function AccountPage({ userId }: { userId: string }) {
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

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect('/sign-in');
  }
  return (
    <div>
      {userData.name}
    </div>
  )
}

import { Metadata } from 'next';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Gym ERP',
};

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect('/sign-in');
  }

  const [userData] = await getDb()
    .select({ name: user.name, role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!userData) {
    redirect('/sign-in');
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p className="text-black dark:text-white">
        Hello {userData.name}, you are a(n) {userData.role}
      </p>
    </div>
  );
}
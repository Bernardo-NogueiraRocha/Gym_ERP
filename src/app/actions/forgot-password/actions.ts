'use server';

import { getDb } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function checkEmailAndReset(email: string) {
  
  const [existingUser] = await getDb()
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!existingUser) {
    return { success: false, message: 'No registered account has that email.' };
  }

  return { success: true, message:'' };
}
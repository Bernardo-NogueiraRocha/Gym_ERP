'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { getDb } from '@/db';
import { professionals, user } from '@/db/schema';
import { getSession } from '@/lib/auth-server';

const professionalIdSchema = z.string().uuid('Invalid professional.');

export type ApproveProfessionalResult =
  | { success: true }
  | { success: false; error: string };

export async function approveProfessionalAction(
  professionalId: string,
): Promise<ApproveProfessionalResult> {
  const session = await getSession().catch(() => null);

  if (!session?.user?.id) {
    return { success: false, error: 'You must be signed in as an administrator.' };
  }

  const parsed = professionalIdSchema.safeParse(professionalId);

  if (!parsed.success) {
    return { success: false, error: 'Invalid professional.' };
  }

  const db = getDb();

  try {
    const [admin] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (admin?.role !== 'admin') {
      return { success: false, error: 'Administrator access is required.' };
    }

    const [target] = await db
      .select({
        approved: professionals.approved,
        role: user.role,
      })
      .from(professionals)
      .innerJoin(user, eq(user.id, professionals.userId))
      .where(eq(professionals.id, parsed.data))
      .limit(1);

    if (!target || target.role !== 'professional') {
      return { success: false, error: 'Professional account not found.' };
    }

    if (!target.approved) {
      await db
        .update(professionals)
        .set({ approved: true })
        .where(eq(professionals.id, parsed.data));
    }

    revalidatePath('/verify-professionals');
    revalidatePath('/');
    revalidatePath('/account');

    return { success: true };
  } catch {
    console.error('Failed to approve professional.');
    return {
      success: false,
      error: 'We could not approve this professional. Please try again.',
    };
  }
}

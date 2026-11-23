import { getDb } from '@/db';
import { professionals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getProfessionalProfile(userId: string) {
  const [professional] = await getDb()
    .select({
      id: professionals.id,
      cref: professionals.cref,
      specialty: professionals.specialty,
      approved: professionals.approved,
    })
    .from(professionals)
    .where(eq(professionals.userId, userId))
    .limit(1);

  return professional ?? null;
}

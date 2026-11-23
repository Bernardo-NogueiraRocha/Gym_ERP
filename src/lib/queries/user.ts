import { getDb } from "@/db";
import { account, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserData(userId: string) {
  const db = getDb();

  const result = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  return result ?? null;
}

export async function getLinkedAccountProviders(userId: string) {
  const rows = await getDb()
    .select({ providerId: account.providerId })
    .from(account)
    .where(eq(account.userId, userId));

  return rows.map((row) => row.providerId);
}

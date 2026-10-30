import { getDb } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserData(userId: string) {
  const db = getDb();

  const result = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  return result ?? null;
}

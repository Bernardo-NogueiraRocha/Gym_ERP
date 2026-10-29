import { getDb } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

type UserColumns = {
    [K in keyof typeof user.$inferSelect]?: boolean;
};

export async function getUserData(userId: string, columns?: UserColumns) {
    try {
        const db = getDb();
        const result = await db.query.user.findFirst({
            where: eq(user.id, userId),
            columns: columns,
        });

        return result ?? null;
    } catch (error) {
        console.error("Database error while fetching user data:", error);
        return null;
    }
}
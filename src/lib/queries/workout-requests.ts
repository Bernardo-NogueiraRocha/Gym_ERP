import { workoutRequests, students, user } from "@/db/schema";
import { getDb } from "@/db";
import { eq,desc } from "drizzle-orm";

export async function getWorkoutRequests() {
    const result = await getDb()
        .select({
            requestId: workoutRequests.id,
            studentId: students.id,
            studentName: user.name,
            experienceLevel: workoutRequests.experienceLevel,
            priorities: workoutRequests.priorities,
            hasInjuries: workoutRequests.hasInjuries,
            injuryDetails: workoutRequests.injuryDetails,
            solved: workoutRequests.solved,
            submissionDate: workoutRequests.createdAt,
        })
        .from(workoutRequests)
        .innerJoin(students, eq(workoutRequests.studentId, students.id))
        .innerJoin(user, eq(students.userId, user.id))
        .orderBy(desc(workoutRequests.createdAt)); // Latest requests first
    return result;
}
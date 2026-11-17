// Plans
import { getPlans } from "./queries/plans";
export type Plan = Awaited<ReturnType<typeof getPlans>>[number];

// Users
import type { getUserData } from "@/lib/queries/user";
export type UserData = NonNullable<
  Awaited<ReturnType<typeof getUserData>>
>;

//Students / Account
import type { getStudentList } from "@/lib/queries/students";
export type StudentList = NonNullable<
  Awaited<ReturnType<typeof getStudentList>>
>;

export type AccountProps = {
    userData: UserData | null;
};
// Exercises (attend-workout)
import { getAllExercises, getExercisesWorkoutItems } from "./queries/exercises";
export type WorkoutItems = Awaited<ReturnType<typeof getExercisesWorkoutItems>>;
export type ExerciseOption = Awaited<ReturnType<typeof getAllExercises>>[number];
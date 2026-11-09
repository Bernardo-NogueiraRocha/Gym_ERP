import { getPlans } from "./queries/plans";

export type Plan = Awaited<ReturnType<typeof getPlans>>[number];

import type { getUserData } from "@/lib/queries/user";

export type UserData = NonNullable<
  Awaited<ReturnType<typeof getUserData>>
>;

import type { getStudentList } from "@/lib/queries/students";

export type StudentList = NonNullable<
  Awaited<ReturnType<typeof getStudentList>>
>;

export type AccountProps = {
    userData: UserData | null;
};
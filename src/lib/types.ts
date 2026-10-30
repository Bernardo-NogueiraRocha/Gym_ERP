import { getPlans } from "./queries/plans";

export type Plan = Awaited<ReturnType<typeof getPlans>>[number];

import type { getUserData } from "@/lib/queries/user";

export type UserData = NonNullable<
  Awaited<ReturnType<typeof getUserData>>
>;

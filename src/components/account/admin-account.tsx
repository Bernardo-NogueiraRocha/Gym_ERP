import type { AccountProps } from "@/lib/types";
import { AccountInfo } from "./Information-card";

export function AdminAccount({ userData }: AccountProps) {
  return (
    <div>
      <AccountInfo userData={userData}/>
    </div>
  );
}
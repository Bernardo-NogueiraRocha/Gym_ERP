import { AccountProps } from "@/lib/types";
import { AccountInfo } from "./Information-card";

export function ProfessionalAccount({ userData }: AccountProps) {
  return (
    <div className="w-full">
      <AccountInfo userData={userData} />
    </div>
  );
}
import { AccountProps } from "@/lib/types";
import { AccountInfo } from "./Information-card";
import { MembershipInfo } from "./membership-info";


export function StudentAccount({ userData }: AccountProps) {
  if (userData==null){
    return(
      <div>
        Data not found
      </div>
    )
  }
  return (
    <div>
      <AccountInfo userData={userData} />
      <MembershipInfo userId={userData.id}/>
    </div>
  );
}
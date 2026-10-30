import type { UserData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';

type AdminAccountProps = {
  userData: UserData | null;
};

export function AdminAccount({ userData }: AdminAccountProps) {
  if (!userData) {
    return (
      <div className="p-6 text-center text-slate-400">
        User not found
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-lg space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        {userData.image ? (
          <Image 
            src={userData.image} 
            height={60} 
            width={60} 
            alt="Profile Picture"
            className="rounded-full object-cover border border-slate-700"
          />
        ) : (
          <div className="w-[60px] h-[60px] rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xl">
            {userData.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}

        <div className="space-y-1 overflow-hidden">
          <h1 className="text-xl font-semibold text-white truncate">
            {userData.name}
          </h1>
          <p className="text-sm font-medium text-slate-400 truncate">
            {userData.email}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-800 flex justify-center">
        <Link href='/sign-out'>
          <Button variant="destructive" size="default" className='w-full sm:w-auto'>
            Sign-out
          </Button>
        </Link>
      </div>
    </div>
  );
}
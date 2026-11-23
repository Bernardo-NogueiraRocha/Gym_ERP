import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import type { AccountProps } from "@/lib/types";

export function AccountInfo({ userData }: AccountProps) {
    if (!userData) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                User not found
            </div>
        );
    }
    return (
    <div className="mx-10 mt-5 space-y-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        {/* Profile Header */}
        <div className="mx-5 mt-5 flex items-center gap-4">
            {userData.image ? (
                <Image
                    src={userData.image}
                    height={60}
                    width={60}
                    alt="Profile Picture"
                    className="rounded-full border border-border object-cover"
                />
            ) : (
                <div className="flex size-15 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
                    {userData.name?.[0]?.toUpperCase() ?? "U"}
                </div>
            )}

            <div className="space-y-1 overflow-hidden">
                <h1 className="truncate text-2xl font-semibold text-foreground">
                    {userData.name}
                </h1>
                <p className="truncate font-medium text-muted-foreground">
                    {userData.email}
                </p>
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center border-t border-border pt-4">
            <Link href='/sign-out'>
                <Button variant="destructive" size="default" className='mb-2 w-full text-[16px] sm:w-auto'>
                    Sign-out
                </Button>
            </Link>
        </div>
    </div>
    )
}
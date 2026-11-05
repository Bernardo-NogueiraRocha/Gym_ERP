import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AccessDenied({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-red-950/40 border border-red-500/50 p-6 rounded-xl max-w-md shadow-lg">
                <h2 className="text-xl font-bold text-red-200 mb-2">Access Denied</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    {message}
                </p>
                <Button variant="default">
                    <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button variant="default">
                    <Link href="/sign-up">Sign up</Link>
                </Button>
            </div>
        </div>
    );
}
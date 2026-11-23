import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AccessDenied({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-md rounded-xl border border-destructive/40 bg-destructive/10 p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-bold text-destructive">Access Denied</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    {message}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="default">
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button variant="outline">
                        <Link href="/sign-up">Sign up</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
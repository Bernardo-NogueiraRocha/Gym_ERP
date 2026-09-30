import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    const isAuthRoute =
        request.nextUrl.pathname.startsWith('/sign-in') ||
        request.nextUrl.pathname.startsWith('/sign-up');
    
    const plansPage = request.nextUrl.pathname.startsWith('/plans');

    const isDashboardRoute =
        request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboardRoute && !sessionCookie) {
        return NextResponse.redirect(
            new URL('/sign-in', request.url)
        );
    }

    if (isAuthRoute && sessionCookie) {
        if (plansPage){
            return NextResponse.redirect(
            new URL('/plans', request.url)
            )
        }
        else{
            return NextResponse.redirect(
            new URL('/dashboard', request.url)
        );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/sign-in',
        '/sign-up',
        '/plans'
    ],
};
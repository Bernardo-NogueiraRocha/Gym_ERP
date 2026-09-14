import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up');
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  // If user is trying to access dashboard unlogged, redirect to login
  if (isDashboardRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  // If user is authenticated and trying to sign-up or sign-in, redirect to dashboard.
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up'],
};
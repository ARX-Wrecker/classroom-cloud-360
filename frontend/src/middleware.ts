import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard', '/courses/', '/my-courses', '/create-course',
  '/users', '/certificates', '/messages', '/settings',
  '/assignments', '/grades', '/calendar', '/forum',
  '/notifications', '/documents', '/quizzes', '/attendance',
  '/analytics', '/admin', '/profile', '/videoclases',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('cc360_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/my-courses/:path*',
    '/create-course/:path*',
    '/users/:path*',
    '/certificates/:path*',
    '/messages/:path*',
    '/settings/:path*',
    '/assignments/:path*',
    '/grades/:path*',
    '/calendar/:path*',
    '/forum/:path*',
    '/notifications/:path*',
    '/documents/:path*',
    '/quizzes/:path*',
    '/attendance/:path*',
    '/analytics/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/videoclases/:path*',
  ],
};

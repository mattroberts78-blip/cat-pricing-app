import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/api/search', '/api/pricing', '/login'];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p));
  const cookie = req.cookies.get('session');
  if (isPublic || cookie?.value === 'ok') {
    return NextResponse.next();
  }
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
};

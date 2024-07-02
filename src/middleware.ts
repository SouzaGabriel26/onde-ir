import { NextRequest, NextResponse } from 'next/server';

import { constants } from './utils/constants';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(constants.accessTokenKey)?.value;
  const { pathname } = request.nextUrl;

  const isAuthPath = pathname.startsWith('/auth');
  const isPrivatePath = pathname.startsWith('/dashboard');

  if (!accessToken && isPrivatePath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (accessToken && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { constants } from './utils/constants';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(constants.accessTokenKey)?.value;
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY!),
      );

      if (payload.sub) {
        response.headers.set('x-user-id', payload.sub);
      }
    } catch {
      response.cookies.delete(constants.accessTokenKey);
    }
  }

  const isAuthPath = pathname.startsWith('/auth');
  const isPrivatePath = pathname.startsWith('/dashboard');

  if (!accessToken && isPrivatePath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (accessToken && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

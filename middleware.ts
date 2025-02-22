import { jwtVerify } from 'jose';
import { type NextRequest, NextResponse } from 'next/server';

import { constants } from './utils/constants';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(constants.accessTokenKey)?.value;

  const response = NextResponse.next();

  if (accessToken) {
    try {
      await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY!),
      );
    } catch {
      response.cookies.delete(constants.accessTokenKey);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico)(?!auth).*)'],
};

import { constants } from '@/utils/constants';
import { navItems } from '@/utils/navItems';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(constants.access_token_key)?.value;
  const response = NextResponse.next();

  const privatePages = navItems
    .filter((item) => item.auth.isPrivate)
    .map((item) => item.href as string);

  if (!accessToken && privatePages.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(constants.jwt_secret),
      );

      const { sub: userId } = payload;
      if (userId) {
        response.headers.set(constants.user_id_header_key, userId);
      }

      const onlyNotSignedInPages = navItems
        .filter((item) => item.auth.onlyNotSignedIn)
        .map((item) => item.href as string);

      if (onlyNotSignedInPages.includes(pathname) && userId) {
        if (process.env.NODE_ENV === 'development') {
          cookies().delete(constants.access_token_key);
        }
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      response.cookies.delete(constants.access_token_key);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

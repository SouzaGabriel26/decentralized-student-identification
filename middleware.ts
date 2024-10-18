import { constants } from '@/utils/constants';
import { navItems } from '@/utils/navItems';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(constants.access_token_key)?.value;
  const response = NextResponse.next();

  if (!accessToken && isPrivatePage(pathname)) {
    return redirectToHomePage(request);
  }

  if (accessToken) {
    if (isOnlyNotSignedInPage(pathname)) {
      return redirectToHomePage(request);
    }

    try {
      const secret = new TextEncoder().encode(constants.jwt_secret);

      await jwtVerify(accessToken, secret);
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

function redirectToHomePage(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url));
}

function isOnlyNotSignedInPage(pathname: string) {
  const onlyNotSignedInPages = navItems
    .filter((item) => item.auth.onlyNotSignedIn)
    .map((item) => item.href as string);

  return onlyNotSignedInPages.includes(pathname);
}

function isPrivatePage(pathname: string) {
  const privatePages = navItems
    .filter((item) => item.auth.isPrivate)
    .map((item) => item.href as string);

  return privatePages.includes(pathname);
}

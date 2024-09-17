import { NextRequest, NextResponse } from 'next/server';
import { cryptography } from './services/cryptography';
import { navItems } from './utils/navItems';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access:token')?.value;
  const response = NextResponse.next();

  const privatePages = navItems
    .filter((item) => item.auth.isPrivate)
    .map((item) => item.href as string);

  if (!accessToken && privatePages.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (accessToken) {
    try {
      const { sub } = await cryptography.verifyToken(accessToken);

      if (sub) {
        response.headers.set('x-user-id', sub);
      }

      const onlyNotSignedInPages = navItems
        .filter((item) => item.auth.onlyNotSignedIn)
        .map((item) => item.href as string);

      if (onlyNotSignedInPages.includes(pathname) && sub) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.log(error);
      response.cookies.delete('access:token');
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

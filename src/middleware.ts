
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const locales = ['en', 'fr']; 
const defaultLocale = 'en'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next(); // Path already has a locale, proceed
  }

  // Path is missing a locale, redirect to the default locale
  const newUrl = request.nextUrl.clone();
  // If pathname is '/', new path becomes '/en'
  // If pathname is '/somepage', new path becomes '/en/somepage'
  newUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and specific files like favicon.ico
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
};

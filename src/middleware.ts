import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const locales = ['en', 'fr']; // Should match next.config.js
const defaultLocale = 'en'; // Should match next.config.js

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

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale and it's not the root path trying to be accessed directly
  // (e.g. /about -> /en/about)
  if (pathnameIsMissingLocale) {
    const url = request.nextUrl.clone();
    // Prepend the default locale
    url.pathname = `/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and specific files like favicon.ico
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
};

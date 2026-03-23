import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const handleI18nRouting = createMiddleware(routing);
const CANONICAL_HOST = 'saheeb.com';
const CANONICAL_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);
const INTERNAL_PREFIXES = ['/api', '/_next', '/_vercel'];
const PUBLIC_FILE = /\.[^/]+$/;

function isSupportedLocale(locale: string | undefined): locale is 'ar' | 'en' {
  return routing.locales.includes(locale as 'ar' | 'en');
}

function getLocaleFromAcceptLanguage(header: string) {
  const languages = header
    .split(',')
    .map((entry) => {
      const [rawLanguage, ...params] = entry.trim().split(';');
      const qParam = params.find((param) => param.trim().startsWith('q='));
      const quality = qParam ? Number(qParam.trim().slice(2)) : 1;

      return {
        language: rawLanguage.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 1,
      };
    })
    .sort((left, right) => right.quality - left.quality);

  for (const { language } of languages) {
    const baseLocale = language.split('-')[0];
    if (isSupportedLocale(baseLocale)) {
      return baseLocale;
    }
  }

  return routing.defaultLocale;
}

function getPreferredLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('preferred-locale')?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  return getLocaleFromAcceptLanguage(acceptLanguage);
}

function redirectToCanonicalUrl(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    request.nextUrl.host;

  if (!host || !CANONICAL_HOSTS.has(host)) {
    return null;
  }

  const forwardedProto = request.headers.get('x-forwarded-proto');
  const protocol = forwardedProto ?? request.nextUrl.protocol.replace(':', '');
  if (protocol === 'https' && host === CANONICAL_HOST) {
    return null;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = 'https';
  redirectUrl.host = CANONICAL_HOST;

  return NextResponse.redirect(redirectUrl, 308);
}

export default function middleware(request: NextRequest) {
  const canonicalResponse = redirectToCanonicalUrl(request);
  if (canonicalResponse) {
    return canonicalResponse;
  }

  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const locale = getPreferredLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}`;
    return NextResponse.redirect(redirectUrl, 307);
  }

  if (
    INTERNAL_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    return handleI18nRouting(request);
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return handleI18nRouting(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Only handle locale-prefixed paths - root is handled by (root)/page.tsx
  matcher: ['/(ar|en)/:path*'],
};

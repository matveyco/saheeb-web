export type PageVariant = 'organic_main' | 'paid_lp' | 'other';

export function getPageVariant(pathname: string | null | undefined) {
  if (!pathname) {
    return null;
  }

  if (pathname === '/projects/saheeb-drive/lp') {
    return 'paid_lp' as const;
  }

  if (
    pathname === '/projects/saheeb-drive' ||
    pathname === '/projects/saheeb-drive/waitlist'
  ) {
    return 'organic_main' as const;
  }

  return pathname.startsWith('/projects/saheeb-drive') ? 'other' : null;
}

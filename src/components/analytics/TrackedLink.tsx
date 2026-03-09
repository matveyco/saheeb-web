'use client';

import { ComponentProps } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { trackEvent } from '@/lib/analytics';

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  ctaLocation: string;
  destinationPath: string;
  project?: string;
}

export function TrackedLink({
  ctaLocation,
  destinationPath,
  project,
  onClick,
  ...props
}: TrackedLinkProps) {
  const locale = useLocale();

  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        trackEvent('cta_click', {
          cta_location: ctaLocation,
          destination_path: destinationPath,
          project,
          site_locale: locale,
        });
      }}
    />
  );
}

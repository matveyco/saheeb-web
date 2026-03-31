'use client';

import { ComponentProps } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { recordFunnelEvent } from '@/lib/funnel';

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

        recordFunnelEvent({
          eventName: 'cta_click',
          siteLocale: locale,
          ctaLocation,
          destinationPath,
          project,
          payload: {
            cta_location: ctaLocation,
            destination_path: destinationPath,
            project: project ?? null,
            site_locale: locale,
          },
        });
      }}
    />
  );
}

'use client';

import { ComponentProps } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { recordFunnelEvent, type FunnelEventName } from '@/lib/funnel';

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  ctaLocation: string;
  destinationPath: string;
  eventName?: FunnelEventName;
  project?: string;
  userType?: 'buyer' | 'seller';
  intentSource?: string;
}

export function TrackedLink({
  ctaLocation,
  destinationPath,
  eventName = 'cta_click',
  project,
  userType,
  intentSource,
  onClick,
  ...props
}: TrackedLinkProps) {
  const locale = useLocale();

  return (
    <Link
      {...props}
      onClick={(event) => {
        recordFunnelEvent({
          eventName,
          siteLocale: locale,
          userType,
          ctaLocation,
          destinationPath,
          intentSource,
          project,
          payload: {
            cta_location: ctaLocation,
            destination_path: destinationPath,
            intent_source: intentSource ?? null,
            project: project ?? null,
            site_locale: locale,
            user_type: userType ?? null,
          },
        });

        onClick?.(event);
      }}
    />
  );
}

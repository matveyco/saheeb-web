'use client';

import type { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Button, type ButtonProps } from '@/components/ui';
import { recordFunnelEvent } from '@/lib/funnel';
import {
  DRIVE_WAITLIST_EVENT,
  type DriveWaitlistEventDetail,
} from '@/components/sections/drive/events';

interface DriveIntentButtonProps
  extends Omit<ButtonProps, 'children' | 'onClick'> {
  intent: 'buyer' | 'seller';
  ctaLocation: string;
  children: ReactNode;
}

export function DriveIntentButton({
  intent,
  ctaLocation,
  children,
  ...buttonProps
}: DriveIntentButtonProps) {
  const locale = useLocale();

  return (
    <Button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      onClick={() => {
        recordFunnelEvent({
          eventName: 'cta_click',
          siteLocale: locale,
          userType: intent,
          ctaLocation,
          destinationPath: '#drive-waitlist',
          project: 'saheeb_drive',
          payload: {
            cta_location: ctaLocation,
            destination_path: '#drive-waitlist',
            project: 'saheeb_drive',
            site_locale: locale,
            user_type: intent,
          },
        });

        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set('focus', 'waitlist');
        nextUrl.searchParams.set('intent', intent);
        window.history.replaceState(
          {},
          '',
          `${nextUrl.pathname}${nextUrl.search}#drive-waitlist`
        );

        window.dispatchEvent(
          new CustomEvent<DriveWaitlistEventDetail>(DRIVE_WAITLIST_EVENT, {
            detail: {
              intent,
              source: ctaLocation,
            },
          })
        );
      }}
    >
      {children}
    </Button>
  );
}

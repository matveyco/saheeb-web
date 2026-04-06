'use client';

import type { MouseEvent, ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Button, type ButtonProps } from '@/components/ui';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { dispatchDriveWaitlistEvent } from '@/components/sections/drive/events';
import type { PageVariant } from '@/lib/page-variant';

interface DriveIntentButtonProps
  extends Omit<ButtonProps, 'children' | 'asChild' | 'onClick'> {
  intent: 'buyer' | 'seller';
  ctaLocation: string;
  children: ReactNode;
  pageVariant?: PageVariant;
}

function getDriveBasePath(pageVariant?: PageVariant) {
  if (pageVariant === 'paid_lp') {
    return '/projects/saheeb-drive/lp';
  }

  return '/projects/saheeb-drive';
}

export function DriveIntentButton({
  intent,
  ctaLocation,
  children,
  pageVariant,
  ...buttonProps
}: DriveIntentButtonProps) {
  const pathname = usePathname();
  const basePath = getDriveBasePath(pageVariant);
  const href = `${basePath}?focus=waitlist&intent=${intent}#drive-waitlist`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentPathname = pathname || window.location.pathname;
    const isSameDrivePage =
      currentPathname === basePath || currentPathname.endsWith(basePath);

    if (!isSameDrivePage) {
      return;
    }

    event.preventDefault();

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('focus', 'waitlist');
    nextUrl.searchParams.set('intent', intent);
    window.history.replaceState(
      {},
      '',
      `${nextUrl.pathname}${nextUrl.search}#drive-waitlist`
    );

    dispatchDriveWaitlistEvent({
      intent,
      source: ctaLocation,
    });
  };

  return (
    <Button {...buttonProps} asChild>
      <TrackedLink
        href={href}
        ctaLocation={ctaLocation}
        destinationPath={href}
        project="saheeb_drive"
        userType={intent}
        intentSource={ctaLocation}
        onClick={handleClick}
      >
        {children}
      </TrackedLink>
    </Button>
  );
}

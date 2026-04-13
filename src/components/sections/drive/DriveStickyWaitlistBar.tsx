'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DriveIntentButton } from '@/components/sections/drive/DriveIntentButton';
import { DriveWaitlistCounter } from '@/components/sections/drive/DriveWaitlistCounter';
import type { PageVariant } from '@/lib/page-variant';

interface DriveStickyWaitlistBarProps {
  pageVariant: PageVariant;
}

export function DriveStickyWaitlistBar({
  pageVariant,
}: DriveStickyWaitlistBarProps) {
  const t = useTranslations('saheebDrive');
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('drive-hero');
    const waitlist = document.getElementById('drive-waitlist');

    if (!hero || !waitlist) {
      return;
    }

    let heroVisible = true;
    let waitlistVisible = false;

    const updateStickyBar = () => {
      setShowStickyBar(!heroVisible && !waitlistVisible);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        updateStickyBar();
      },
      { threshold: 0.1 }
    );

    const waitlistObserver = new IntersectionObserver(
      ([entry]) => {
        waitlistVisible = entry.isIntersecting;
        updateStickyBar();
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -45% 0px',
      }
    );

    heroObserver.observe(hero);
    waitlistObserver.observe(waitlist);

    return () => {
      heroObserver.disconnect();
      waitlistObserver.disconnect();
    };
  }, []);

  if (!showStickyBar) {
    return null;
  }

  return (
    <div
      data-testid="drive-sticky-bar"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#222225] bg-[#09090B]/96 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden"
    >
      <div className="mb-2 flex items-center justify-center">
        <DriveWaitlistCounter variant="sticky" className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-amber-400" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <DriveIntentButton
          intent="buyer"
          ctaLocation="saheeb_drive_sticky_mobile_buy"
          pageVariant={pageVariant}
          size="md"
          className="w-full"
        >
          {t('stickyCta.buy')}
        </DriveIntentButton>
        <DriveIntentButton
          intent="seller"
          ctaLocation="saheeb_drive_sticky_mobile_sell"
          pageVariant={pageVariant}
          variant="secondary"
          size="md"
          className="w-full"
        >
          {t('stickyCta.sell')}
        </DriveIntentButton>
      </div>
    </div>
  );
}

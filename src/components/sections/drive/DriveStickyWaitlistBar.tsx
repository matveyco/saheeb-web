'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DriveIntentButton } from '@/components/sections/drive/DriveIntentButton';
import { useWaitlistCount } from '@/components/sections/drive/useWaitlistCount';
import type { PageVariant } from '@/lib/page-variant';

const FOUNDER_SPOTS_CAP = 1000;
const VISUAL_FLOOR = 930;

interface DriveStickyWaitlistBarProps {
  pageVariant: PageVariant;
}

export function DriveStickyWaitlistBar({
  pageVariant,
}: DriveStickyWaitlistBarProps) {
  const t = useTranslations('saheebDrive.stickyCta');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const count = useWaitlistCount();

  const taken = count !== null ? Math.max(count, VISUAL_FLOOR) : VISUAL_FLOOR;
  const remaining = Math.max(FOUNDER_SPOTS_CAP - taken, 0);

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
      <DriveIntentButton
        intent="buyer"
        ctaLocation="saheeb_drive_sticky_mobile"
        pageVariant={pageVariant}
        size="lg"
        className="w-full text-base"
      >
        {t('cta', { remaining: String(remaining) })}
      </DriveIntentButton>
    </div>
  );
}

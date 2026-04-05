'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAnalyticsConsent } from '@/components/analytics/AnalyticsProvider';
import { DriveIntentButton } from '@/components/sections/drive/DriveIntentButton';
import { recordFunnelEvent } from '@/lib/funnel';
import type { PageVariant } from '@/lib/page-variant';

interface DriveStickyWaitlistBarProps {
  pageVariant: PageVariant;
}

export function DriveStickyWaitlistBar({
  pageVariant,
}: DriveStickyWaitlistBarProps) {
  const t = useTranslations('saheebDrive');
  const locale = useLocale();
  const { isBannerOpen } = useAnalyticsConsent();
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    recordFunnelEvent({
      eventName: 'drive_page_view',
      siteLocale: locale,
      project: 'saheeb_drive',
      pageVariant,
      payload: {
        page_group: 'saheeb_drive',
        page_variant: pageVariant,
        project: 'saheeb_drive',
        site_locale: locale,
      },
    });
  }, [locale, pageVariant]);

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
      { threshold: 0.2 }
    );

    heroObserver.observe(hero);
    waitlistObserver.observe(waitlist);

    return () => {
      heroObserver.disconnect();
      waitlistObserver.disconnect();
    };
  }, []);

  if (isBannerOpen || !showStickyBar) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#222225] bg-[#09090B]/96 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden">
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#8F8F96]">
        {t('stickyCta.title')}
      </p>
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

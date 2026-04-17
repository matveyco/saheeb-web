'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { recordFunnelEvent } from '@/lib/funnel';
import type { PageVariant } from '@/lib/page-variant';

interface DriveScrollTrackerProps {
  pageVariant: PageVariant;
}

const DEPTHS = [25, 50, 75, 100] as const;

export function DriveScrollTracker({ pageVariant }: DriveScrollTrackerProps) {
  const locale = useLocale();

  useEffect(() => {
    const fired = new Set<number>();

    const report = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const scrollable = Math.max(docHeight - viewport, 1);
      const pct = Math.min(100, Math.round(((scrollTop + viewport) / docHeight) * 100));

      for (const depth of DEPTHS) {
        if (pct >= depth && !fired.has(depth)) {
          fired.add(depth);
          recordFunnelEvent({
            eventName: 'scroll_depth',
            siteLocale: locale,
            pageVariant,
            project: 'saheeb_drive',
            payload: {
              depth,
              page_variant: pageVariant,
              site_locale: locale,
            },
          });
        }
      }

      if (fired.size === DEPTHS.length) {
        window.removeEventListener('scroll', onScroll);
      }

      void scrollable;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        report();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    report();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [locale, pageVariant]);

  return null;
}

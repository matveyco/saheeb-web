'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { recordFunnelEvent } from '@/lib/funnel';
import type { PageVariant } from '@/lib/page-variant';

interface DriveTimingTrackerProps {
  pageVariant: PageVariant;
}

export function DriveTimingTracker({ pageVariant }: DriveTimingTrackerProps) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;

    let lcp: number | null = null;
    let fcp: number | null = null;
    let ttfb: number | null = null;
    let reported = false;

    const navEntries = performance.getEntriesByType?.('navigation') as
      | PerformanceNavigationTiming[]
      | undefined;
    if (navEntries && navEntries[0]) {
      ttfb = Math.round(navEntries[0].responseStart);
    }

    let lcpObserver: PerformanceObserver | null = null;
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as
          | (PerformanceEntry & { startTime: number })
          | undefined;
        if (last) lcp = Math.round(last.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}

    let fcpObserver: PerformanceObserver | null = null;
    try {
      fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            fcp = Math.round(entry.startTime);
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch {}

    const report = () => {
      if (reported) return;
      reported = true;
      recordFunnelEvent({
        eventName: 'page_timing',
        siteLocale: locale,
        pageVariant,
        project: 'saheeb_drive',
        payload: {
          lcp_ms: lcp ?? -1,
          fcp_ms: fcp ?? -1,
          ttfb_ms: ttfb ?? -1,
          page_variant: pageVariant,
          site_locale: locale,
        },
      });
    };

    const onHide = () => {
      if (document.visibilityState === 'hidden') report();
    };

    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', report);
    const flushTimer = window.setTimeout(report, 5000);

    return () => {
      lcpObserver?.disconnect();
      fcpObserver?.disconnect();
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', report);
      window.clearTimeout(flushTimer);
    };
  }, [locale, pageVariant]);

  return null;
}

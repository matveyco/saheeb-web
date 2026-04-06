'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import {
  canUseAnalyticsRuntime,
  initializeAnalytics,
  setAnalyticsContext,
  shouldTrackPath,
  trackPageView,
} from '@/lib/analytics';
import { captureAttribution, readAttributionSnapshot } from '@/lib/attribution';
import { ensureAnalyticsIdentity } from '@/lib/analytics-identity';

interface AnalyticsConsentContextValue {
  consent: 'accepted';
  isAvailable: boolean;
  isBannerOpen: false;
  openSettings: () => void;
  acceptAnalytics: () => void;
  declineAnalytics: () => void;
}

const noop = () => {};

const AnalyticsConsentContext =
  createContext<AnalyticsConsentContextValue | null>(null);

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isAvailable = isHydrated && canUseAnalyticsRuntime();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    captureAttribution(pathname);
    ensureAnalyticsIdentity();
  }, [isHydrated, pathname]);

  useEffect(() => {
    if (!isAvailable) {
      return;
    }

    initializeAnalytics(pathname);
  }, [isAvailable, pathname]);

  useEffect(() => {
    if (!isAvailable || !shouldTrackPath(pathname)) {
      return;
    }

    trackPageView({ locale, pathname });

    const attribution = readAttributionSnapshot();
    const searchParams =
      typeof window === 'undefined'
        ? null
        : new URLSearchParams(window.location.search);
    setAnalyticsContext({
      locale,
      pathname,
      intent: searchParams?.get('intent'),
      utmSource: attribution?.utmSource,
      utmCampaign: attribution?.utmCampaign,
    });
  }, [isAvailable, locale, pathname]);

  const contextValue = useMemo(
    () => ({
      consent: 'accepted' as const,
      isAvailable,
      isBannerOpen: false as const,
      openSettings: noop,
      acceptAnalytics: noop,
      declineAnalytics: noop,
    }),
    [isAvailable]
  );

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent() {
  const context = useContext(AnalyticsConsentContext);

  if (!context) {
    throw new Error('useAnalyticsConsent must be used within AnalyticsProvider');
  }

  return context;
}

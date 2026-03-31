'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import {
  canUseAnalyticsRuntime,
  initializeAnalytics,
  persistAnalyticsConsent,
  readAnalyticsConsent,
  shouldAutoShowAnalyticsBanner,
  shouldTrackPath,
  trackPageView,
  type AnalyticsConsent,
} from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';

interface AnalyticsConsentContextValue {
  consent: AnalyticsConsent | null;
  isAvailable: boolean;
  isBannerOpen: boolean;
  openSettings: () => void;
  acceptAnalytics: () => void;
  declineAnalytics: () => void;
}

const AnalyticsConsentContext =
  createContext<AnalyticsConsentContextValue | null>(null);

function AnalyticsConsentBanner({
  isOpen,
  onAccept,
  onDecline,
}: {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const t = useTranslations('analyticsConsent');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#2A2A2E] bg-[#111113]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-[#EDEDEF]">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#8F8F96]">
              {t('description')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:min-w-[220px]">
            <button
              type="button"
              onClick={onAccept}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#C9A87C] px-5 py-3 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#D4B78E]"
            >
              {t('accept')}
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#333338] px-5 py-3 text-sm font-semibold text-[#EDEDEF] transition-colors hover:bg-[#19191B]"
            >
              {t('decline')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() =>
    typeof window === 'undefined' ? null : readAnalyticsConsent()
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const lastTrackedLandingPath = useRef<string | null>(null);
  const isAvailable = isHydrated && canUseAnalyticsRuntime();
  const isBannerOpen =
    isAvailable &&
    shouldTrackPath(pathname) &&
    (isSettingsOpen || shouldAutoShowAnalyticsBanner(consent));

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    captureAttribution(pathname);
  }, [isHydrated, pathname]);

  useEffect(() => {
    if (!isAvailable) {
      return;
    }

    initializeAnalytics(consent);
  }, [consent, isAvailable]);

  useEffect(() => {
    if (!isAvailable || !shouldTrackPath(pathname)) {
      return;
    }

    if (consent === 'accepted') {
      trackPageView({ locale, pathname, mode: 'full' });
      return;
    }

    if (lastTrackedLandingPath.current === pathname) {
      return;
    }

    trackPageView({ locale, pathname, mode: 'landing' });
    lastTrackedLandingPath.current = pathname;
  }, [consent, isAvailable, locale, pathname]);

  const acceptAnalytics = useCallback(() => {
    persistAnalyticsConsent('accepted');
    setConsent('accepted');
    setIsSettingsOpen(false);
  }, []);

  const declineAnalytics = useCallback(() => {
    persistAnalyticsConsent('declined');
    setConsent('declined');
    setIsSettingsOpen(false);
  }, []);

  const openSettings = useCallback(() => {
    if (!isAvailable || !shouldTrackPath(pathname)) {
      return;
    }

    setIsSettingsOpen(true);
  }, [isAvailable, pathname]);

  const contextValue = useMemo(
    () => ({
      consent,
      isAvailable,
      isBannerOpen,
      openSettings,
      acceptAnalytics,
      declineAnalytics,
    }),
    [
      acceptAnalytics,
      consent,
      declineAnalytics,
      isAvailable,
      isBannerOpen,
      openSettings,
    ]
  );

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      <AnalyticsConsentBanner
        isOpen={isBannerOpen}
        onAccept={acceptAnalytics}
        onDecline={declineAnalytics}
      />
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

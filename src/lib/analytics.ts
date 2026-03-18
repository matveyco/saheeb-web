export const ANALYTICS_CONSENT_STORAGE_KEY = 'saheeb-analytics-consent';
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? '';

const PRODUCTION_HOSTS = new Set(['saheeb.com', 'www.saheeb.com']);
const EXCLUDED_PATH_PREFIXES = ['/admin', '/style-guide'];

export type AnalyticsConsent = 'accepted' | 'declined';
export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface MetaPixelFunction {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[][];
    push?: MetaPixelFunction;
    loaded?: boolean;
    version?: string;
  }

  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    __saheebAnalyticsInitialized?: boolean;
    __saheebMetaPixelInitialized?: boolean;
  }
}

function getAnalyticsWindow() {
  return window as unknown as Window & Record<string, unknown>;
}

function sanitizeParams(params: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
}

export function canUseAnalyticsRuntime() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    process.env.NODE_ENV === 'production' &&
    Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID) &&
    PRODUCTION_HOSTS.has(window.location.hostname)
  );
}

export function shouldTrackPath(pathname: string) {
  return !EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function getLocalePath(locale: string, pathname: string) {
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

export function getPageGroup(pathname: string) {
  if (pathname === '/') {
    return 'home';
  }

  if (pathname === '/contact') {
    return 'contact';
  }

  if (pathname === '/privacy' || pathname === '/terms') {
    return 'legal';
  }

  if (pathname === '/services') {
    return 'services';
  }

  if (pathname === '/projects') {
    return 'projects';
  }

  if (pathname === '/projects/saheeb-drive/waitlist') {
    return 'saheeb_drive_waitlist';
  }

  if (pathname.startsWith('/projects/saheeb-drive')) {
    return 'saheeb_drive';
  }

  return 'other';
}

export function getProjectName(pathname: string) {
  if (pathname.startsWith('/projects/saheeb-drive')) {
    return 'saheeb_drive';
  }

  return undefined;
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return stored === 'accepted' || stored === 'declined' ? stored : null;
}

export function persistAnalyticsConsent(consent: AnalyticsConsent) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
}

export function shouldAutoShowAnalyticsBanner(
  consent: AnalyticsConsent | null
) {
  if (typeof window === 'undefined') {
    return false;
  }

  return consent === null;
}

export function setAnalyticsDisabled(disabled: boolean) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    return;
  }

  getAnalyticsWindow()[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled;
}

export function ensureGtagBootstrap() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

export function ensureFbqBootstrap() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
        return;
      }

      fbq.queue?.push(args);
    }) as MetaPixelFunction;

    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
  }

  if (!window._fbq) {
    window._fbq = window.fbq;
  }
}

export function initializeAnalytics() {
  if (!canUseAnalyticsRuntime()) {
    return;
  }

  if (GA_MEASUREMENT_ID) {
    ensureGtagBootstrap();

    if (!window.__saheebAnalyticsInitialized) {
      window.gtag?.('consent', 'default', { analytics_storage: 'denied' });
      window.gtag?.('js', new Date());
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      window.__saheebAnalyticsInitialized = true;
    }

    setAnalyticsDisabled(false);
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  }

  if (META_PIXEL_ID) {
    ensureFbqBootstrap();

    if (!window.__saheebMetaPixelInitialized) {
      window.fbq?.('consent', 'revoke');
      window.fbq?.('init', META_PIXEL_ID);
      window.__saheebMetaPixelInitialized = true;
    }

    window.fbq?.('consent', 'grant');
  }
}

export function disableAnalytics() {
  if (typeof window === 'undefined') {
    return;
  }

  if (GA_MEASUREMENT_ID) {
    setAnalyticsDisabled(true);
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }

  if (META_PIXEL_ID) {
    window.fbq?.('consent', 'revoke');
  }
}

function trackGoogleEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  ensureGtagBootstrap();
  window.gtag?.('event', eventName, sanitizeParams(params));
}

function trackMetaStandardEvent(
  eventName: 'PageView' | 'Lead' | 'Contact',
  params: AnalyticsEventParams = {}
) {
  if (!META_PIXEL_ID) {
    return;
  }

  ensureFbqBootstrap();
  window.fbq?.('track', eventName, sanitizeParams(params));
}

function trackMetaCustomEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (!META_PIXEL_ID) {
    return;
  }

  ensureFbqBootstrap();
  window.fbq?.('trackCustom', eventName, sanitizeParams(params));
}

function trackMetaEvent(eventName: string, params: AnalyticsEventParams = {}) {
  switch (eventName) {
    case 'waitlist_submit_success':
      trackMetaStandardEvent('Lead', {
        content_category: 'saheeb_drive',
        content_name: 'Saheeb Drive Waitlist',
      });
      break;
    case 'contact_submit_success':
      trackMetaStandardEvent('Contact', {
        content_category: 'contact',
        content_name: 'Saheeb Contact Inquiry',
      });
      break;
    default:
      break;
  }

  trackMetaCustomEvent(eventName, params);
}

export function trackEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (!canUseAnalyticsRuntime() || readAnalyticsConsent() !== 'accepted') {
    return;
  }

  trackGoogleEvent(eventName, params);
  trackMetaEvent(eventName, params);
}

export function trackPageView({
  locale,
  pathname,
}: {
  locale: string;
  pathname: string;
}) {
  if (!canUseAnalyticsRuntime() || readAnalyticsConsent() !== 'accepted') {
    return;
  }

  if (!shouldTrackPath(pathname)) {
    return;
  }

  const pageViewParams = {
    page_title: document.title,
    page_location: window.location.href,
    page_path: getLocalePath(locale, pathname),
    page_group: getPageGroup(pathname),
    project: getProjectName(pathname),
    site_locale: locale,
  };

  trackGoogleEvent('page_view', pageViewParams);
  trackMetaStandardEvent('PageView');
}

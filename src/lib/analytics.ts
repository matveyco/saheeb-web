import { getPageVariant } from '@/lib/page-variant';

export const ANALYTICS_CONSENT_STORAGE_KEY = 'saheeb-analytics-consent';
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? '';
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() ?? '';

const PRODUCTION_HOSTS = new Set(['saheeb.com', 'www.saheeb.com']);
const EXCLUDED_PATH_PREFIXES = ['/admin', '/style-guide'];
const ALWAYS_ON_CONVERSION_EVENTS = new Set([
  'waitlist_submit_success',
  'contact_submit_success',
]);

export type AnalyticsConsent = 'accepted';
export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;
type ClarityTagValue = string | number | boolean;

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
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    __saheebAnalyticsInitialized?: boolean;
    __saheebMetaPixelInitialized?: boolean;
    __saheebClarityInitialized?: boolean;
  }
}

function sanitizeParams(params: AnalyticsEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
}

function sanitizeMetaParams(params: AnalyticsEventParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) => key !== 'event_id' && value !== undefined
    )
  );
}

function getMetaEventOptions(params: AnalyticsEventParams = {}) {
  const eventId = params.event_id;
  if (
    typeof eventId !== 'string' &&
    typeof eventId !== 'number' &&
    typeof eventId !== 'boolean'
  ) {
    return undefined;
  }

  return {
    eventID: String(eventId),
  };
}

export function canUseAnalyticsRuntime() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    process.env.NODE_ENV === 'production' &&
    Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID || CLARITY_PROJECT_ID) &&
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

export function readAnalyticsConsent(): AnalyticsConsent {
  return 'accepted';
}

export function persistAnalyticsConsent() {}

export function shouldAutoShowAnalyticsBanner() {
  return false;
}

function updateGoogleAnalyticsConsent() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    return;
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
  });
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

export function ensureClarityBootstrap() {
  if (!CLARITY_PROJECT_ID || typeof window === 'undefined') {
    return;
  }

  const existingScript = document.querySelector(
    `script[data-saheeb-clarity="true"], script[src="https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}"]`
  );

  if (existingScript) {
    window.__saheebClarityInitialized = true;
  }

  if (window.__saheebClarityInitialized) {
    return;
  }

  window.__saheebClarityInitialized = true;

  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      const clarity = window.clarity as ((...args: unknown[]) => void) & {
        q?: unknown[][];
      };
      clarity.q = clarity.q || [];
      clarity.q.push(args);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  script.setAttribute('data-saheeb-clarity', 'true');
  document.head.appendChild(script);
}

function shouldEnableClarity(pathname?: string) {
  return Boolean(pathname && shouldTrackPath(pathname));
}

export function initializeAnalytics(pathname?: string) {
  if (!canUseAnalyticsRuntime()) {
    return;
  }

  if (GA_MEASUREMENT_ID) {
    ensureGtagBootstrap();

    if (!window.__saheebAnalyticsInitialized) {
      window.gtag?.('consent', 'default', { analytics_storage: 'granted' });
      window.gtag?.('js', new Date());
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      window.__saheebAnalyticsInitialized = true;
    }

    updateGoogleAnalyticsConsent();
  }

  if (META_PIXEL_ID) {
    ensureFbqBootstrap();

    if (!window.__saheebMetaPixelInitialized) {
      window.fbq?.('init', META_PIXEL_ID);
      window.__saheebMetaPixelInitialized = true;
    }
  }

  if (CLARITY_PROJECT_ID && shouldEnableClarity(pathname)) {
    ensureClarityBootstrap();
  }
}

export function disableAnalytics() {}

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
  window.fbq?.(
    'track',
    eventName,
    sanitizeMetaParams(params),
    getMetaEventOptions(params)
  );
}

function trackMetaCustomEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (!META_PIXEL_ID) {
    return;
  }

  ensureFbqBootstrap();
  window.fbq?.(
    'trackCustom',
    eventName,
    sanitizeMetaParams(params),
    getMetaEventOptions(params)
  );
}

function trackMetaConversionEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  switch (eventName) {
    case 'waitlist_submit_success':
      trackMetaStandardEvent('Lead', {
        content_category: 'saheeb_drive',
        content_name: 'Saheeb Drive Waitlist',
        event_id: params.event_id,
      });
      break;
    case 'contact_submit_success':
      trackMetaStandardEvent('Contact', {
        content_category: 'contact',
        content_name: 'Saheeb Contact Inquiry',
        event_id: params.event_id,
      });
      break;
    default:
      break;
  }

  trackMetaCustomEvent(eventName, params);
}

function trackConversionEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  trackGoogleEvent(eventName, params);
  trackMetaConversionEvent(eventName, params);
}

export function trackEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (!canUseAnalyticsRuntime()) {
    return;
  }

  if (ALWAYS_ON_CONVERSION_EVENTS.has(eventName)) {
    trackConversionEvent(eventName, params);
    return;
  }

  trackGoogleEvent(eventName, params);
  trackMetaCustomEvent(eventName, params);
}

export function trackPageView({
  locale,
  pathname,
}: {
  locale: string;
  pathname: string;
}) {
  if (!canUseAnalyticsRuntime()) {
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
    page_variant: getPageVariant(pathname) ?? 'other',
    project: getProjectName(pathname),
    site_locale: locale,
  };

  trackGoogleEvent('page_view', pageViewParams);
  trackMetaStandardEvent('PageView');
}

export function setClarityTag(
  key: string,
  value: ClarityTagValue | null | undefined
) {
  if (
    typeof window === 'undefined' ||
    !CLARITY_PROJECT_ID ||
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return;
  }

  window.clarity?.('set', key, value);
}

export function setAnalyticsContext({
  locale,
  pathname,
  intent,
  utmSource,
  utmCampaign,
}: {
  locale: string;
  pathname: string;
  intent?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
}) {
  if (!canUseAnalyticsRuntime() || !shouldEnableClarity(pathname)) {
    return;
  }

  setClarityTag('page_variant', getPageVariant(pathname) ?? 'other');
  setClarityTag('site_locale', locale);
  setClarityTag('intent', intent ?? 'buyer');
  setClarityTag('utm_source', utmSource ?? 'direct');
  setClarityTag('utm_campaign', utmCampaign ?? 'unattributed');
}

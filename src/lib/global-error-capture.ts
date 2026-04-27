'use client';

import { recordFunnelEvent } from '@/lib/funnel';

// Diagnostic-only: capture window.onerror + unhandledrejection and forward
// to the funnel event pipeline as `client_error`. Sampled to avoid
// flooding GA4/the funnel API on a noisy page.

const MAX_ERRORS_PER_SESSION = 5;
const STORAGE_KEY = 'saheeb_client_error_count';
const MAX_MESSAGE_LENGTH = 240;
const MAX_SOURCE_LENGTH = 240;

let hasInstalled = false;

function detectBrowserApp(ua: string): string {
  if (!ua) return 'unknown';
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return 'facebook_app';
  if (/Instagram/.test(ua)) return 'instagram_app';
  if (/LinkedInApp/.test(ua)) return 'linkedin_app';
  if (/(?:^|\s)Twitter\b/.test(ua)) return 'twitter_app';
  if (/TikTok/.test(ua)) return 'tiktok_app';
  if (/CriOS|Chrome/.test(ua)) return 'chrome';
  if (/FxiOS|Firefox/.test(ua)) return 'firefox';
  if (/EdgiOS|Edg/.test(ua)) return 'edge';
  if (/Safari/.test(ua)) return 'safari';
  return 'other';
}

function readSessionCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const v = window.sessionStorage?.getItem(STORAGE_KEY);
    return v ? Number(v) || 0 : 0;
  } catch {
    return 0;
  }
}

function bumpSessionCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const next = readSessionCount() + 1;
    window.sessionStorage?.setItem(STORAGE_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
}

function clip(value: string | undefined | null, max: number): string {
  if (!value) return '';
  return value.length > max ? value.slice(0, max) : value;
}

function send(payload: {
  message: string;
  source?: string;
  line?: number;
  column?: number;
  stage: 'error' | 'unhandledrejection';
  locale: string;
  pageVariant:
    | 'organic_main'
    | 'paid_lp'
    | 'other';
}) {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const browserApp = detectBrowserApp(ua);

  // Inside try/catch: never let our error reporter throw and trigger
  // its own listener.
  try {
    recordFunnelEvent({
      eventName: 'client_error',
      siteLocale: payload.locale,
      pageVariant: payload.pageVariant,
      errorStage: payload.stage,
      analyticsEventName: 'client_error',
      analyticsParams: {
        message: clip(payload.message, MAX_MESSAGE_LENGTH),
        source: clip(payload.source, MAX_SOURCE_LENGTH),
        line: payload.line ?? 0,
        column: payload.column ?? 0,
        browser_app: browserApp,
        error_stage: payload.stage,
        page_variant: payload.pageVariant,
        site_locale: payload.locale,
      },
      payload: {
        message: clip(payload.message, MAX_MESSAGE_LENGTH),
        source: clip(payload.source, MAX_SOURCE_LENGTH),
        line: payload.line ?? 0,
        column: payload.column ?? 0,
        browser_app: browserApp,
        error_stage: payload.stage,
      },
    });
  } catch {
    // intentionally swallow — diagnostic must not affect the page
  }
}

function getCurrentLocale(pathname: string): string {
  if (pathname.startsWith('/ar/') || pathname === '/ar') return 'ar';
  return 'en';
}

function getCurrentVariant(
  pathname: string
): 'organic_main' | 'paid_lp' | 'other' {
  if (pathname.endsWith('/lp') || pathname.includes('/lp?')) return 'paid_lp';
  if (pathname.includes('/projects/saheeb-drive')) return 'organic_main';
  return 'other';
}

export function installGlobalErrorCapture() {
  if (hasInstalled) return;
  if (typeof window === 'undefined') return;

  hasInstalled = true;

  const onError = (event: ErrorEvent) => {
    if (readSessionCount() >= MAX_ERRORS_PER_SESSION) return;
    bumpSessionCount();

    const pathname = window.location.pathname;
    send({
      message: event.message ?? 'unknown error',
      source: event.filename ?? '',
      line: event.lineno ?? 0,
      column: event.colno ?? 0,
      stage: 'error',
      locale: getCurrentLocale(pathname),
      pageVariant: getCurrentVariant(pathname),
    });
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    if (readSessionCount() >= MAX_ERRORS_PER_SESSION) return;
    bumpSessionCount();

    const reason = event.reason;
    let message: string;
    if (reason instanceof Error) {
      message = reason.message;
    } else if (typeof reason === 'string') {
      message = reason;
    } else {
      try {
        message = JSON.stringify(reason)?.slice(0, MAX_MESSAGE_LENGTH) ?? 'unknown';
      } catch {
        message = 'unhandledrejection';
      }
    }

    const pathname = window.location.pathname;
    send({
      message,
      stage: 'unhandledrejection',
      locale: getCurrentLocale(pathname),
      pageVariant: getCurrentVariant(pathname),
    });
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
}

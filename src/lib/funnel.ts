'use client';

import {
  getPageGroup,
  getProjectName,
  trackEvent,
  type AnalyticsEventParams,
} from '@/lib/analytics';
import { readAttributionSnapshot } from '@/lib/attribution';

export type FunnelEventName =
  | 'drive_page_view'
  | 'waitlist_view'
  | 'cta_click'
  | 'form_start'
  | 'validation_error'
  | 'waitlist_submit_success';

type FunnelPayloadValue = string | number | boolean | null;
type FunnelPayload = Record<string, FunnelPayloadValue>;

interface RecordFunnelEventInput {
  eventName: FunnelEventName;
  siteLocale: string;
  userType?: 'buyer' | 'seller';
  ctaLocation?: string;
  destinationPath?: string;
  formName?: string;
  errorStage?: string;
  pageGroup?: string;
  project?: string;
  payload?: FunnelPayload;
  analyticsEventName?: string | null;
  analyticsParams?: AnalyticsEventParams;
}

function trimOptional(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizePayload(payload?: FunnelPayload) {
  return Object.fromEntries(
    Object.entries(payload ?? {}).filter(([, value]) => value !== undefined)
  );
}

function sanitizeAnalyticsPayload(payload?: FunnelPayload) {
  return Object.fromEntries(
    Object.entries(payload ?? {}).filter(([, value]) => value != null)
  ) as AnalyticsEventParams;
}

function normalizeLocalePath(pathname: string, siteLocale: string) {
  const localePrefix = `/${siteLocale}`;

  if (pathname === localePrefix) {
    return '/';
  }

  if (pathname.startsWith(`${localePrefix}/`)) {
    return pathname.slice(localePrefix.length);
  }

  return pathname;
}

function sendFirstPartyEvent(body: Record<string, unknown>) {
  const serialized = JSON.stringify(body);

  const sendBeaconFallback = () => {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
      return;
    }

    const blob = new Blob([serialized], {
      type: 'application/json',
    });
    navigator.sendBeacon('/api/funnel', blob);
  };

  void fetch('/api/funnel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: serialized,
    keepalive: true,
    credentials: 'same-origin',
  })
    .then((response) => {
      if (!response.ok) {
        sendBeaconFallback();
      }
    })
    .catch(() => {
      sendBeaconFallback();
    });
}

export function recordFunnelEvent({
  eventName,
  siteLocale,
  userType,
  ctaLocation,
  destinationPath,
  formName,
  errorStage,
  pageGroup,
  project,
  payload,
  analyticsEventName,
  analyticsParams,
}: RecordFunnelEventInput) {
  if (typeof window === 'undefined') {
    return;
  }

  const pathname = normalizeLocalePath(window.location.pathname, siteLocale);
  const attribution = readAttributionSnapshot();
  const sanitizedPayload = sanitizePayload(payload);
  const analyticsPayload = sanitizeAnalyticsPayload(payload);

  sendFirstPartyEvent({
    eventName,
    path: pathname,
    pageGroup: pageGroup ?? getPageGroup(pathname),
    project: project ?? getProjectName(pathname) ?? null,
    siteLocale,
    userType: userType ?? null,
    ctaLocation: trimOptional(ctaLocation),
    destinationPath: trimOptional(destinationPath),
    formName: trimOptional(formName),
    errorStage: trimOptional(errorStage),
    utmSource: attribution?.utmSource ?? null,
    utmMedium: attribution?.utmMedium ?? null,
    utmCampaign: attribution?.utmCampaign ?? null,
    utmContent: attribution?.utmContent ?? null,
    referrer: attribution?.referrer ?? null,
    landingPath: attribution?.landingPath ?? pathname,
    payload: sanitizedPayload,
  });

  if (analyticsEventName === null) {
    return;
  }

  trackEvent(analyticsEventName ?? eventName, {
    ...analyticsPayload,
    ...(analyticsParams ?? {}),
  });
}

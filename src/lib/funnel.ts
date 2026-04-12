'use client';

import {
  getPageGroup,
  getProjectName,
  trackEvent,
  type AnalyticsEventParams,
} from '@/lib/analytics';
import {
  createAnalyticsEventId,
  ensureAnalyticsIdentity,
} from '@/lib/analytics-identity';
import { captureAttribution, readAttributionSnapshot } from '@/lib/attribution';
import { getPageVariant, type PageVariant } from '@/lib/page-variant';

export type FunnelEventName =
  | 'drive_page_view'
  | 'waitlist_view'
  | 'cta_click'
  | 'form_start'
  | 'form_submit_attempt'
  | 'validation_error'
  | 'waitlist_submit_success'
  | 'waitlist_submit_duplicate'
  | 'share_click'
  | 'privacy_click'
  | 'language_switch'
  | 'nav_exit';

type FunnelPayloadValue = string | number | boolean | null;
type FunnelPayload = Record<string, FunnelPayloadValue>;
type FirstPartyBody = Record<string, unknown>;

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
  pageVariant?: PageVariant;
  intentSource?: string;
  eventId?: string;
  payload?: FunnelPayload;
  analyticsEventName?: string | null;
  analyticsParams?: AnalyticsEventParams;
}

const MAX_BATCH_SIZE = 10;
const FLUSH_DELAY_MS = 350;

let firstPartyQueue: FirstPartyBody[] = [];
let flushTimer: number | null = null;
let isFlushing = false;
let hasLifecycleHooks = false;

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

function sendBeaconBatch(events: FirstPartyBody[]) {
  if (
    typeof navigator === 'undefined' ||
    typeof navigator.sendBeacon !== 'function' ||
    events.length === 0
  ) {
    return false;
  }

  const blob = new Blob([JSON.stringify(events)], {
    type: 'application/json',
  });

  return navigator.sendBeacon('/api/funnel', blob);
}

async function flushFirstPartyQueue(options?: { preferBeacon?: boolean }) {
  if (typeof window === 'undefined' || isFlushing || firstPartyQueue.length === 0) {
    return;
  }

  isFlushing = true;

  try {
    while (firstPartyQueue.length > 0) {
      const batch = firstPartyQueue.splice(0, MAX_BATCH_SIZE);

      if (options?.preferBeacon && sendBeaconBatch(batch)) {
        continue;
      }

      try {
        const response = await fetch('/api/funnel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batch),
          keepalive: true,
          credentials: 'same-origin',
        });

        if (!response.ok && !sendBeaconBatch(batch)) {
          firstPartyQueue = [...batch, ...firstPartyQueue];
          break;
        }
      } catch {
        if (!sendBeaconBatch(batch)) {
          firstPartyQueue = [...batch, ...firstPartyQueue];
          break;
        }
      }
    }
  } finally {
    isFlushing = false;

    if (firstPartyQueue.length > 0 && !options?.preferBeacon) {
      scheduleQueueFlush(true);
    }
  }
}

function scheduleQueueFlush(immediate = false) {
  if (typeof window === 'undefined') {
    return;
  }

  if (flushTimer !== null) {
    window.clearTimeout(flushTimer);
  }

  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushFirstPartyQueue();
  }, immediate ? 0 : FLUSH_DELAY_MS);
}

function ensureLifecycleHooks() {
  if (typeof window === 'undefined' || hasLifecycleHooks) {
    return;
  }

  hasLifecycleHooks = true;

  const flushForLifecycle = () => {
    void flushFirstPartyQueue({ preferBeacon: true });
  };

  window.addEventListener('pagehide', flushForLifecycle);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushForLifecycle();
    }
  });
}

function enqueueFirstPartyEvent(body: FirstPartyBody) {
  if (typeof window === 'undefined') {
    return;
  }

  ensureLifecycleHooks();
  firstPartyQueue.push(body);
  scheduleQueueFlush(firstPartyQueue.length >= MAX_BATCH_SIZE);
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
  pageVariant,
  intentSource,
  eventId,
  payload,
  analyticsEventName,
  analyticsParams,
}: RecordFunnelEventInput) {
  if (typeof window === 'undefined') {
    return null;
  }

  const pathname = normalizeLocalePath(window.location.pathname, siteLocale);
  const attribution = readAttributionSnapshot() ?? captureAttribution(pathname);
  const analyticsIdentity = ensureAnalyticsIdentity();
  const sanitizedPayload = sanitizePayload(payload);
  const analyticsPayload = sanitizeAnalyticsPayload(payload);
  const resolvedEventId = eventId ?? createAnalyticsEventId(eventName);
  const resolvedPageVariant = pageVariant ?? getPageVariant(pathname);

  enqueueFirstPartyEvent({
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
    anonymousId: analyticsIdentity.anonymousId,
    sessionId: analyticsIdentity.sessionId,
    pageVariant: resolvedPageVariant,
    eventId: resolvedEventId,
    intentSource: trimOptional(intentSource),
    utmSource: attribution?.utmSource ?? null,
    utmMedium: attribution?.utmMedium ?? null,
    utmCampaign: attribution?.utmCampaign ?? null,
    utmContent: attribution?.utmContent ?? null,
    referrer: attribution?.referrer ?? null,
    landingPath: attribution?.landingPath ?? pathname,
    payload: sanitizedPayload,
  });

  if (analyticsEventName === null) {
    return resolvedEventId;
  }

  trackEvent(analyticsEventName ?? eventName, {
    ...analyticsPayload,
    event_id: resolvedEventId,
    page_variant: resolvedPageVariant ?? 'other',
    intent_source: trimOptional(intentSource) ?? undefined,
    ...(analyticsParams ?? {}),
  });

  return resolvedEventId;
}

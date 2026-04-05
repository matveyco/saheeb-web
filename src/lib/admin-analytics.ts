import type { FunnelEvent, WaitlistEntry } from '@/db';

const SUMMARY_WINDOWS = [7, 30] as const;

type SummaryWindowDays = (typeof SUMMARY_WINDOWS)[number];
type BreakdownKind =
  | 'normalizedSources'
  | 'sources'
  | 'campaigns'
  | 'locales'
  | 'countries'
  | 'intents'
  | 'pageVariants';

type FunnelMetricKey =
  | 'drivePageViews'
  | 'waitlistViews'
  | 'ctaClicks'
  | 'formStarts'
  | 'submitAttempts'
  | 'submitSuccesses'
  | 'duplicateSubmits'
  | 'validationErrors';

interface SummaryCounts {
  drivePageViews: number;
  waitlistViews: number;
  ctaClicks: number;
  formStarts: number;
  submitAttempts: number;
  submitSuccesses: number;
  duplicateSubmits: number;
  validationErrors: number;
  leads: number;
  uniqueReachableLeads: number;
}

interface BreakdownAccumulator extends SummaryCounts {
  label: string;
}

export interface AdminAnalyticsBreakdownItem extends SummaryCounts {
  label: string;
}

export interface AdminAnalyticsSummaryWindow {
  days: SummaryWindowDays;
  totals: SummaryCounts;
  rates: {
    ctaFromView: number | null;
    waitlistFromClick: number | null;
    startFromWaitlistView: number | null;
    submitFromStart: number | null;
    submitFromAttempt: number | null;
    duplicateFromSubmit: number | null;
  };
  breakdowns: Record<BreakdownKind, AdminAnalyticsBreakdownItem[]>;
}

export interface AdminAnalyticsSummary {
  generatedAt: string;
  windows: AdminAnalyticsSummaryWindow[];
}

const ZERO_COUNTS: SummaryCounts = {
  drivePageViews: 0,
  waitlistViews: 0,
  ctaClicks: 0,
  formStarts: 0,
  submitAttempts: 0,
  submitSuccesses: 0,
  duplicateSubmits: 0,
  validationErrors: 0,
  leads: 0,
  uniqueReachableLeads: 0,
};

const FUNNEL_METRIC_BY_EVENT: Record<string, FunnelMetricKey | undefined> = {
  drive_page_view: 'drivePageViews',
  waitlist_view: 'waitlistViews',
  cta_click: 'ctaClicks',
  form_start: 'formStarts',
  form_submit_attempt: 'submitAttempts',
  waitlist_submit_success: 'submitSuccesses',
  waitlist_submit_duplicate: 'duplicateSubmits',
  validation_error: 'validationErrors',
};

function normalizeText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function titleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizePhone(value: string | null | undefined) {
  const normalized = normalizeText(value)?.replace(/[^\d+]/g, '');
  return normalized && normalized.length > 0 ? normalized : null;
}

function getReachableLeadKey(entry: WaitlistEntry) {
  const email = normalizeText(entry.email)?.toLowerCase();
  if (email) {
    return `email:${email}`;
  }

  const phone = normalizePhone(entry.phone);
  return phone ? `phone:${phone}` : null;
}

function getReferrerHost(value: string | null | undefined) {
  const referrer = normalizeText(value);
  if (!referrer) {
    return null;
  }

  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return referrer;
  }
}

function getRawSourceLabel(input: {
  utmSource?: string | null;
  utmMedium?: string | null;
  referrer?: string | null;
}) {
  const source = normalizeText(input.utmSource);
  const medium = normalizeText(input.utmMedium);
  const referrerHost = getReferrerHost(input.referrer);

  if (source || medium) {
    return [source ?? 'unknown', medium ?? 'unknown'].join(' / ');
  }

  if (referrerHost) {
    return `referral / ${referrerHost}`;
  }

  return 'direct / unattributed';
}

function getNormalizedSourceLabel(input: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
}) {
  const source = normalizeText(input.utmSource)?.toLowerCase();
  const medium = normalizeText(input.utmMedium)?.toLowerCase();
  const content = normalizeText(input.utmContent)?.toLowerCase();
  const referrerHost = getReferrerHost(input.referrer)?.toLowerCase();

  if (source === 'ig' || source === 'instagram') {
    return medium === 'paid' ? 'Instagram paid' : 'Instagram';
  }

  if (source === 'fb' || source === 'facebook') {
    return medium === 'paid' ? 'Facebook paid' : 'Facebook';
  }

  if (source === 'metaads' || source === 'meta' || source === 'meta ads') {
    if (medium?.includes('carousel') || content?.includes('carousel')) {
      return 'Meta carousel';
    }

    if (medium?.includes('banner') || content?.includes('banner')) {
      return 'Meta banner';
    }

    return 'Meta ads';
  }

  if (referrerHost?.includes('instagram')) {
    return 'Instagram referral';
  }

  if (referrerHost?.includes('facebook')) {
    return 'Facebook referral';
  }

  if (medium === 'paid') {
    return `${titleCase(source ?? 'Paid')} paid`;
  }

  if (source) {
    return titleCase(source);
  }

  return 'Direct / unattributed';
}

function getCampaignLabel(input: {
  utmCampaign?: string | null;
  landingPath?: string | null;
}) {
  return normalizeText(input.utmCampaign) ?? normalizeText(input.landingPath) ?? 'unattributed';
}

function getLocaleLabel(value: string | null | undefined) {
  return normalizeText(value) ?? 'unknown';
}

function getCountryLabel(value: string | null | undefined) {
  return normalizeText(value)?.toUpperCase() ?? 'unknown';
}

function getIntentLabel(value: string | null | undefined) {
  const normalized = normalizeText(value)?.toLowerCase();

  switch (normalized) {
    case 'buyer':
      return 'buyer';
    case 'seller':
      return 'seller';
    default:
      return 'unknown';
  }
}

function getPageVariantLabel(value: string | null | undefined) {
  return normalizeText(value) ?? 'unknown';
}

function getBreakdownLabelFromEntry(kind: BreakdownKind, entry: WaitlistEntry) {
  switch (kind) {
    case 'normalizedSources':
      return getNormalizedSourceLabel(entry);
    case 'sources':
      return getRawSourceLabel(entry);
    case 'campaigns':
      return getCampaignLabel(entry);
    case 'locales':
      return getLocaleLabel(entry.locale);
    case 'countries':
      return getCountryLabel(entry.countryCode);
    case 'intents':
      return getIntentLabel(entry.userType);
    case 'pageVariants':
      return getPageVariantLabel(entry.pageVariant);
  }
}

function getBreakdownLabelFromEvent(kind: BreakdownKind, event: FunnelEvent) {
  switch (kind) {
    case 'normalizedSources':
      return getNormalizedSourceLabel(event);
    case 'sources':
      return getRawSourceLabel(event);
    case 'campaigns':
      return getCampaignLabel(event);
    case 'locales':
      return getLocaleLabel(event.siteLocale);
    case 'countries':
      return getCountryLabel(event.countryCode);
    case 'intents':
      return getIntentLabel(event.userType);
    case 'pageVariants':
      return getPageVariantLabel(event.pageVariant);
  }
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function isWithinDays(value: Date | string, days: number, now: Date) {
  const date = toDate(value);
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() - days);
  return date >= threshold;
}

function createBreakdownAccumulator(label: string): BreakdownAccumulator {
  return {
    label,
    ...ZERO_COUNTS,
  };
}

function addLeadToAccumulator(accumulator: BreakdownAccumulator) {
  accumulator.leads += 1;
}

function addEventToAccumulator(
  accumulator: BreakdownAccumulator,
  eventName: string
) {
  const metricKey = FUNNEL_METRIC_BY_EVENT[eventName];
  if (!metricKey) {
    return;
  }

  accumulator[metricKey] += 1;
}

function buildBreakdownItems(
  kind: BreakdownKind,
  entries: WaitlistEntry[],
  events: FunnelEvent[]
) {
  const buckets = new Map<string, BreakdownAccumulator>();

  for (const entry of entries) {
    const label = getBreakdownLabelFromEntry(kind, entry);
    const existing = buckets.get(label) ?? createBreakdownAccumulator(label);
    addLeadToAccumulator(existing);
    buckets.set(label, existing);
  }

  for (const event of events) {
    const label = getBreakdownLabelFromEvent(kind, event);
    const existing = buckets.get(label) ?? createBreakdownAccumulator(label);
    addEventToAccumulator(existing, event.eventName);
    buckets.set(label, existing);
  }

  return Array.from(buckets.values())
    .sort((left, right) => {
      return (
        right.submitSuccesses - left.submitSuccesses ||
        right.leads - left.leads ||
        right.ctaClicks - left.ctaClicks ||
        left.label.localeCompare(right.label)
      );
    })
    .slice(0, 8);
}

function buildSummaryCounts(entries: WaitlistEntry[], events: FunnelEvent[]) {
  const counts: SummaryCounts = {
    ...ZERO_COUNTS,
    leads: entries.length,
    uniqueReachableLeads: new Set(
      entries
        .map(getReachableLeadKey)
        .filter((value): value is string => value !== null)
    ).size,
  };

  for (const event of events) {
    const metricKey = FUNNEL_METRIC_BY_EVENT[event.eventName];
    if (metricKey) {
      counts[metricKey] += 1;
    }
  }

  return counts;
}

function ratio(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return null;
  }

  return numerator / denominator;
}

function buildSummaryWindow(
  days: SummaryWindowDays,
  entries: WaitlistEntry[],
  events: FunnelEvent[],
  now: Date
): AdminAnalyticsSummaryWindow {
  const entriesInWindow = entries.filter((entry) =>
    isWithinDays(entry.createdAt, days, now)
  );
  const eventsInWindow = events.filter((event) =>
    isWithinDays(event.createdAt, days, now)
  );
  const totals = buildSummaryCounts(entriesInWindow, eventsInWindow);

  return {
    days,
    totals,
    rates: {
      ctaFromView: ratio(totals.ctaClicks, totals.drivePageViews),
      waitlistFromClick: ratio(totals.waitlistViews, totals.ctaClicks),
      startFromWaitlistView: ratio(totals.formStarts, totals.waitlistViews),
      submitFromStart: ratio(totals.submitSuccesses, totals.formStarts),
      submitFromAttempt: ratio(totals.submitSuccesses, totals.submitAttempts),
      duplicateFromSubmit: ratio(
        totals.duplicateSubmits,
        totals.submitSuccesses + totals.duplicateSubmits
      ),
    },
    breakdowns: {
      normalizedSources: buildBreakdownItems(
        'normalizedSources',
        entriesInWindow,
        eventsInWindow
      ),
      sources: buildBreakdownItems('sources', entriesInWindow, eventsInWindow),
      campaigns: buildBreakdownItems(
        'campaigns',
        entriesInWindow,
        eventsInWindow
      ),
      locales: buildBreakdownItems('locales', entriesInWindow, eventsInWindow),
      countries: buildBreakdownItems(
        'countries',
        entriesInWindow,
        eventsInWindow
      ),
      intents: buildBreakdownItems('intents', entriesInWindow, eventsInWindow),
      pageVariants: buildBreakdownItems(
        'pageVariants',
        entriesInWindow,
        eventsInWindow
      ),
    },
  };
}

export function buildAdminAnalyticsSummary(
  entries: WaitlistEntry[],
  events: FunnelEvent[],
  now = new Date()
): AdminAnalyticsSummary {
  return {
    generatedAt: now.toISOString(),
    windows: SUMMARY_WINDOWS.map((days) =>
      buildSummaryWindow(days, entries, events, now)
    ),
  };
}

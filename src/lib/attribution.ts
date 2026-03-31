export const ATTRIBUTION_STORAGE_KEY = 'saheeb-attribution';

export interface AttributionSnapshot {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  referrer: string | null;
  landingPath: string | null;
}

function trimValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function normalizeStoredValue(value: unknown) {
  return typeof value === 'string' ? trimValue(value) : null;
}

function readStoredSnapshot() {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AttributionSnapshot>;
    return {
      utmSource: normalizeStoredValue(parsed.utmSource),
      utmMedium: normalizeStoredValue(parsed.utmMedium),
      utmCampaign: normalizeStoredValue(parsed.utmCampaign),
      utmContent: normalizeStoredValue(parsed.utmContent),
      referrer: normalizeStoredValue(parsed.referrer),
      landingPath: normalizeStoredValue(parsed.landingPath),
    } satisfies AttributionSnapshot;
  } catch {
    return null;
  }
}

function writeStoredSnapshot(snapshot: AttributionSnapshot) {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {}
}

function getExternalReferrer() {
  if (typeof window === 'undefined') {
    return null;
  }

  const referrer = trimValue(document.referrer);
  if (!referrer) {
    return null;
  }

  try {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.origin === window.location.origin) {
      return null;
    }
  } catch {
    return null;
  }

  return referrer;
}

export function captureAttribution(pathname: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = readStoredSnapshot();
  const searchParams = new URLSearchParams(window.location.search);

  const nextSnapshot: AttributionSnapshot = {
    utmSource: existing?.utmSource ?? trimValue(searchParams.get('utm_source')),
    utmMedium: existing?.utmMedium ?? trimValue(searchParams.get('utm_medium')),
    utmCampaign:
      existing?.utmCampaign ?? trimValue(searchParams.get('utm_campaign')),
    utmContent:
      existing?.utmContent ?? trimValue(searchParams.get('utm_content')),
    referrer: existing?.referrer ?? getExternalReferrer(),
    landingPath: existing?.landingPath ?? trimValue(pathname),
  };

  writeStoredSnapshot(nextSnapshot);
  return nextSnapshot;
}

export function readAttributionSnapshot() {
  return readStoredSnapshot();
}

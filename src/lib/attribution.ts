export const ATTRIBUTION_STORAGE_KEY = 'saheeb-attribution';

export interface AttributionSnapshot {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  referrer: string | null;
  landingPath: string | null;
}

const LANDING_PATH_ALLOWED_PARAMS = new Set(['intent', 'focus']);
const URL_NOISE_PARAMS = new Set([
  'fbclid',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'ttclid',
  'twclid',
  'mc_cid',
  'mc_eid',
]);

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

function buildNormalizedLandingPath(
  pathname: string,
  searchParams: URLSearchParams
) {
  const normalizedParams = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (!LANDING_PATH_ALLOWED_PARAMS.has(key)) {
      continue;
    }

    const trimmedValue = trimValue(value);
    if (trimmedValue) {
      normalizedParams.set(key, trimmedValue);
    }
  }

  const query = normalizedParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

const FBC_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
const FBCLID_VALUE_MAX_LENGTH = 512;

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${escaped}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeFbcCookieIfMissing(searchParams: URLSearchParams) {
  if (typeof document === 'undefined') {
    return;
  }

  const fbclidRaw = searchParams.get('fbclid');
  if (!fbclidRaw) {
    return;
  }

  const fbclid = fbclidRaw.trim().slice(0, FBCLID_VALUE_MAX_LENGTH);
  if (!fbclid || readCookie('_fbc')) {
    return;
  }

  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `_fbc=fb.1.${Date.now()}.${fbclid}; path=/; max-age=${FBC_COOKIE_MAX_AGE_SECONDS}` +
    `; SameSite=Lax${secureFlag}`;
}

function stripNoiseParamsFromCurrentUrl(searchParams: URLSearchParams) {
  if (typeof window === 'undefined') {
    return;
  }

  // Belt-and-suspenders: middleware sets _fbc on first request, but if a route
  // somehow bypasses it (prefetch, edge cache), capture the click ID here
  // before the URL is rewritten.
  writeFbcCookieIfMissing(searchParams);

  let hasNoiseParams = false;
  const nextParams = new URLSearchParams(searchParams);

  for (const param of URL_NOISE_PARAMS) {
    if (!nextParams.has(param)) {
      continue;
    }

    hasNoiseParams = true;
    nextParams.delete(param);
  }

  if (!hasNoiseParams) {
    return;
  }

  const nextSearch = nextParams.toString();
  const nextUrl = `${window.location.pathname}${
    nextSearch ? `?${nextSearch}` : ''
  }${window.location.hash}`;

  window.history.replaceState({}, '', nextUrl);
}

export function captureAttribution(pathname: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = readStoredSnapshot();
  const searchParams = new URLSearchParams(window.location.search);
  const normalizedLandingPath = buildNormalizedLandingPath(pathname, searchParams);

  const nextSnapshot: AttributionSnapshot = {
    utmSource: existing?.utmSource ?? trimValue(searchParams.get('utm_source')),
    utmMedium: existing?.utmMedium ?? trimValue(searchParams.get('utm_medium')),
    utmCampaign:
      existing?.utmCampaign ?? trimValue(searchParams.get('utm_campaign')),
    utmContent:
      existing?.utmContent ?? trimValue(searchParams.get('utm_content')),
    referrer: existing?.referrer ?? getExternalReferrer(),
    landingPath: existing?.landingPath ?? normalizedLandingPath,
  };

  writeStoredSnapshot(nextSnapshot);
  stripNoiseParamsFromCurrentUrl(searchParams);
  return nextSnapshot;
}

export function readAttributionSnapshot() {
  return readStoredSnapshot();
}

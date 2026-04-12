import type { FunnelEvent, WaitlistEntry } from '@/db';

function normalizeText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function hasTestMarker(value: string | null | undefined) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return false;
  }

  return (
    normalized.includes('prod-smoke') ||
    normalized.includes('smoke-test') ||
    normalized.includes('qa-smoke') ||
    normalized.includes('codex-smoke')
  );
}

function isExampleDomainEmail(value: string | null | undefined) {
  const normalized = normalizeText(value);
  return normalized ? normalized.endsWith('@example.com') : false;
}

export function isLikelyInternalWaitlistEntry(entry: WaitlistEntry) {
  return (
    isExampleDomainEmail(entry.email) ||
    hasTestMarker(entry.email) ||
    hasTestMarker(entry.name)
  );
}

export function isLikelyInternalFunnelEvent(event: FunnelEvent) {
  return (
    hasTestMarker(event.anonymousId) ||
    hasTestMarker(event.sessionId) ||
    hasTestMarker(event.eventId) ||
    hasTestMarker(event.landingPath) ||
    hasTestMarker(event.referrer)
  );
}


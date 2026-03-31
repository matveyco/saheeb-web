import { getDb, funnelEvents, type NewFunnelEvent } from '@/db';

function normalizeCountryCode(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().toUpperCase();
  return trimmed.length > 0 ? trimmed.slice(0, 8) : null;
}

export function getRequestCountryCode(request: Request) {
  return normalizeCountryCode(
    request.headers.get('x-vercel-ip-country') ??
      request.headers.get('cf-ipcountry') ??
      request.headers.get('x-country-code')
  );
}

export async function writeFunnelEvent(event: NewFunnelEvent) {
  try {
    const db = getDb();
    await db.insert(funnelEvents).values({
      ...event,
      payload: event.payload ?? {},
    });
    return true;
  } catch (error) {
    console.error('Funnel event logging error:', error);
    return false;
  }
}

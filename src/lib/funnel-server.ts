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

export async function writeFunnelEvents(events: NewFunnelEvent[]) {
  if (events.length === 0) {
    return {
      accepted: 0,
      duplicates: 0,
      failed: 0,
    };
  }

  try {
    const db = getDb();
    const inserted = await db
      .insert(funnelEvents)
      .values(
        events.map((event) => ({
          ...event,
          payload: event.payload ?? {},
        }))
      )
      .onConflictDoNothing({
        target: funnelEvents.eventId,
      })
      .returning({ id: funnelEvents.id });

    const accepted = inserted.length;

    return {
      accepted,
      duplicates: Math.max(0, events.length - accepted),
      failed: 0,
    };
  } catch (error) {
    console.error('Funnel event logging error:', error);
    return {
      accepted: 0,
      duplicates: 0,
      failed: events.length,
    };
  }
}

export async function writeFunnelEvent(event: NewFunnelEvent) {
  const result = await writeFunnelEvents([event]);
  return result.accepted > 0;
}

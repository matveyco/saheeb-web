import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateOrigin, csrfErrorResponse } from '@/lib/csrf';
import {
  funnelEventSchema,
  funnelEventBatchSchema,
  getFirstValidationError,
} from '@/lib/validation';
import {
  getRequestCountryCode,
  writeFunnelEvents,
} from '@/lib/funnel-server';

const RATE_LIMIT = { limit: 240, windowSeconds: 60 };

export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return csrfErrorResponse();
  }

  const clientIP = getClientIP(request);

  try {
    const body = await request.json();
    const parsed = Array.isArray(body)
      ? funnelEventBatchSchema.safeParse(body)
      : funnelEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: getFirstValidationError(parsed.error) },
        { status: 400 }
      );
    }

    const normalizedEvents = Array.isArray(parsed.data)
      ? parsed.data
      : [parsed.data];
    const rateLimitIdentity =
      normalizedEvents[0]?.sessionId ??
      normalizedEvents[0]?.anonymousId ??
      'anonymous';
    const rateLimit = checkRateLimit(
      `funnel:${clientIP}:${rateLimitIdentity}`,
      RATE_LIMIT
    );

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
          },
        }
      );
    }

    const countryCode = getRequestCountryCode(request);
    const result = await writeFunnelEvents(
      normalizedEvents.map((event) => ({
        ...event,
        countryCode,
        payload: event.payload as Record<string, string | number | boolean | null>,
      }))
    );

    return NextResponse.json(
      {
        success: result.failed === 0,
        received: normalizedEvents.length,
        accepted: result.accepted,
        duplicates: result.duplicates,
        failed: result.failed,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('Funnel event route error:', error);
    return NextResponse.json(
      {
        success: false,
        received: 0,
        accepted: 0,
        duplicates: 0,
        failed: 1,
      },
      { status: 202 }
    );
  }
}

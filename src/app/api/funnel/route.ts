import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateOrigin, csrfErrorResponse } from '@/lib/csrf';
import {
  funnelEventSchema,
  getFirstValidationError,
} from '@/lib/validation';
import {
  getRequestCountryCode,
  writeFunnelEvent,
} from '@/lib/funnel-server';

const RATE_LIMIT = { limit: 60, windowSeconds: 60 };

export async function POST(request: NextRequest) {
  if (!validateOrigin(request)) {
    return csrfErrorResponse();
  }

  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(`funnel:${clientIP}`, RATE_LIMIT);

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

  try {
    const body = await request.json();
    const parsed = funnelEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: getFirstValidationError(parsed.error) },
        { status: 400 }
      );
    }

    const success = await writeFunnelEvent({
      ...parsed.data,
      countryCode: getRequestCountryCode(request),
      payload: parsed.data.payload as Record<
        string,
        string | number | boolean | null
      >,
    });

    return NextResponse.json(
      { success },
      { status: 202 }
    );
  } catch (error) {
    console.error('Funnel event route error:', error);
    return NextResponse.json({ success: false }, { status: 202 });
  }
}

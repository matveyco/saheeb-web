import { NextRequest, NextResponse } from 'next/server';
import { funnelEvents, getDb, waitlistEntries } from '@/db';
import { desc } from 'drizzle-orm';
import { createHash, timingSafeEqual } from 'crypto';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { getServerEnv } from '@/lib/env';
import { buildAdminAnalyticsSummary } from '@/lib/admin-analytics';
import { getGa4WaitlistSubmitReport } from '@/lib/ga4-admin';
import {
  isLikelyInternalFunnelEvent,
  isLikelyInternalWaitlistEntry,
} from '@/lib/internal-traffic';

const AUTH_RATE_LIMIT = { limit: 10, windowSeconds: 60 };

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
} as const;

function hashValue(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

function safeEqual(left: string, right: string): boolean {
  return timingSafeEqual(hashValue(left), hashValue(right));
}

function validateBasicAuth(authHeader: string | null): boolean {
  if (!authHeader?.startsWith('Basic ')) {
    return false;
  }

  const encodedCredentials = authHeader.split(' ')[1];
  let credentials = '';

  try {
    credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
  } catch {
    return false;
  }

  const separatorIndex = credentials.indexOf(':');
  if (separatorIndex <= 0) {
    return false;
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  const { ADMIN_USERNAME, ADMIN_PASSWORD } = getServerEnv();

  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);
}

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  const authHeader = request.headers.get('authorization');

  // Validate basic auth
  if (!validateBasicAuth(authHeader)) {
    const authRateLimit = checkRateLimit(`admin-auth:${clientIP}`, AUTH_RATE_LIMIT);
    if (!authRateLimit.success) {
      return new NextResponse('Too many authentication attempts', {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          'Retry-After': String(authRateLimit.resetIn),
        },
      });
    }

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        ...NO_STORE_HEADERS,
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const db = getDb();
    const [entries, events, ga4Report] = await Promise.all([
      db.select().from(waitlistEntries).orderBy(desc(waitlistEntries.createdAt)),
      db.select().from(funnelEvents).orderBy(desc(funnelEvents.createdAt)),
      getGa4WaitlistSubmitReport(30),
    ]);
    const filteredEntries = entries.filter(
      (entry) => !isLikelyInternalWaitlistEntry(entry)
    );
    const filteredEvents = events.filter(
      (event) => !isLikelyInternalFunnelEvent(event)
    );
    const analytics = buildAdminAnalyticsSummary(
      filteredEntries,
      filteredEvents,
      ga4Report
    );

    return NextResponse.json(
      { entries: filteredEntries, analytics },
      {
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      }
    );
  }
}

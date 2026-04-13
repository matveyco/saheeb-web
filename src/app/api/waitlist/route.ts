import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateOrigin, csrfErrorResponse } from '@/lib/csrf';
import { getDb, waitlistEntries } from '@/db';
import { randomUUID } from 'crypto';
import {
  getFirstValidationError,
  waitlistSubmissionSchema,
} from '@/lib/validation';
import {
  getRequestCountryCode,
  writeFunnelEvent,
} from '@/lib/funnel-server';
import { sendMetaWaitlistLeadEvent } from '@/lib/meta-conversions';

// Rate limit: 3 requests per minute per IP (stricter for waitlist)
const RATE_LIMIT = { limit: 3, windowSeconds: 60 };

export async function POST(request: NextRequest) {
  // CSRF validation
  if (!validateOrigin(request)) {
    return csrfErrorResponse();
  }

  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`waitlist:${clientIP}`, RATE_LIMIT);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();
    const parsed = waitlistSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: getFirstValidationError(parsed.error) },
        { status: 400 }
      );
    }

    const waitlistData = parsed.data;
    const countryCode = getRequestCountryCode(request);
    const userAgent = request.headers.get('user-agent');
    const eventId = waitlistData.eventId ?? `lead_${randomUUID()}`;

    const db = getDb();

    const [existingEntry] = await db
      .select({ id: waitlistEntries.id })
      .from(waitlistEntries)
      .where(sql`lower(${waitlistEntries.email}) = lower(${waitlistData.email})`)
      .limit(1);

    if (existingEntry) {
      void writeFunnelEvent({
        eventName: 'waitlist_submit_duplicate',
        path: '/projects/saheeb-drive',
        pageGroup: 'saheeb_drive',
        project: 'saheeb_drive',
        siteLocale: waitlistData.locale,
        userType: waitlistData.userType,
        formName: 'saheeb_drive_waitlist',
        errorStage: null,
        ctaLocation: null,
        destinationPath: null,
        anonymousId: waitlistData.anonymousId,
        sessionId: waitlistData.sessionId,
        pageVariant: waitlistData.pageVariant,
        eventId,
        intentSource: waitlistData.intentSource,
        utmSource: waitlistData.utmSource,
        utmMedium: waitlistData.utmMedium,
        utmCampaign: waitlistData.utmCampaign,
        utmContent: waitlistData.utmContent,
        referrer: waitlistData.referrer,
        landingPath: waitlistData.landingPath,
        countryCode,
        payload: {
          form_name: 'saheeb_drive_waitlist',
          page_variant: waitlistData.pageVariant,
          site_locale: waitlistData.locale,
          user_type: waitlistData.userType,
        },
      });

      return NextResponse.json(
        {
          success: true,
          duplicate: true,
          eventId,
          message: 'Already on waitlist',
        },
        { status: 200 }
      );
    }

    // Insert into database
    await db.insert(waitlistEntries).values({
      ...waitlistData,
      countryCode,
      eventId,
    });

    // Get position for the new entry
    const positionResult = await db.execute(sql<{ count: number }>`
      select count(*)::int as count from waitlist_entries
      where not (
        lower(coalesce(email, '')) like '%@example.com'
        or lower(coalesce(email, '')) like '%prod-smoke%'
        or lower(coalesce(name, '')) like '%prod-smoke%'
        or lower(coalesce(name, '')) like '%codex-smoke%'
      )
    `);
    const position = positionResult.rows[0]?.count ?? 0;

    void writeFunnelEvent({
      eventName: 'waitlist_submit_success',
      path: '/projects/saheeb-drive',
      pageGroup: 'saheeb_drive',
      project: 'saheeb_drive',
      siteLocale: waitlistData.locale,
      userType: waitlistData.userType,
      formName: 'saheeb_drive_waitlist',
      errorStage: null,
      ctaLocation: null,
      destinationPath: null,
      anonymousId: waitlistData.anonymousId,
      sessionId: waitlistData.sessionId,
      pageVariant: waitlistData.pageVariant,
      eventId,
      intentSource: waitlistData.intentSource,
      utmSource: waitlistData.utmSource,
      utmMedium: waitlistData.utmMedium,
      utmCampaign: waitlistData.utmCampaign,
      utmContent: waitlistData.utmContent,
      referrer: waitlistData.referrer,
      landingPath: waitlistData.landingPath,
      countryCode,
      payload: {
        form_name: 'saheeb_drive_waitlist',
        project: 'saheeb_drive',
        page_variant: waitlistData.pageVariant,
        site_locale: waitlistData.locale,
        user_type: waitlistData.userType,
      },
    });

    void sendMetaWaitlistLeadEvent({
      eventId,
      locale: waitlistData.locale,
      name: waitlistData.name,
      email: waitlistData.email,
      phone: waitlistData.phone,
      userType: waitlistData.userType,
      landingPath: waitlistData.landingPath,
      pageVariant: waitlistData.pageVariant,
      intentSource: waitlistData.intentSource,
      countryCode,
      clientIp: clientIP,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        eventId,
        position,
        message: 'Successfully added to waitlist',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint removed for security - use admin dashboard with auth instead

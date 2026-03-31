import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateOrigin, csrfErrorResponse } from '@/lib/csrf';
import { getDb, waitlistEntries } from '@/db';
import {
  getFirstValidationError,
  waitlistSubmissionSchema,
} from '@/lib/validation';
import {
  getRequestCountryCode,
  writeFunnelEvent,
} from '@/lib/funnel-server';

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

    const db = getDb();

    // Insert into database
    await db.insert(waitlistEntries).values({
      ...waitlistData,
      countryCode,
    });

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
        site_locale: waitlistData.locale,
        user_type: waitlistData.userType,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Successfully added to waitlist' },
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

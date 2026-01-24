import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateOrigin, csrfErrorResponse } from '@/lib/csrf';
import { db, waitlistEntries } from '@/db';

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

    // Validate required fields
    const { name, phone, userType, city, consent, locale, consentTimestamp } = body;

    if (!name || !phone || !userType || !city || !consent || !locale || !consentTimestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate consent
    if (consent !== true) {
      return NextResponse.json(
        { error: 'Consent is required' },
        { status: 400 }
      );
    }

    // Insert into database
    await db.insert(waitlistEntries).values({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: body.email ? String(body.email).trim() : null,
      userType: String(userType),
      city: String(city),
      consent: true,
      locale: String(locale),
      consentTimestamp: new Date(consentTimestamp),
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

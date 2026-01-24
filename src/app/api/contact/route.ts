import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { validateOrigin, csrfErrorResponse } from '@/lib/csrf';
import { db, contactSubmissions } from '@/db';
import { sendContactNotification } from '@/lib/email';

// Rate limit: 5 requests per minute per IP
const RATE_LIMIT = { limit: 5, windowSeconds: 60 };

export async function POST(request: NextRequest) {
  // CSRF validation
  if (!validateOrigin(request)) {
    return csrfErrorResponse();
  }

  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(`contact:${clientIP}`, RATE_LIMIT);

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
    const { name, email, message, consent, locale, consentTimestamp } = body;

    if (!name || !email || !message || !consent || !locale || !consentTimestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    const contactData = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: body.phone ? String(body.phone).trim() : null,
      subject: body.subject ? String(body.subject).trim() : null,
      message: String(message).trim(),
      consent: true,
      locale: String(locale),
      consentTimestamp: new Date(consentTimestamp),
    };

    // Insert into database
    await db.insert(contactSubmissions).values(contactData);

    // Send email notification to team
    await sendContactNotification({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      subject: contactData.subject,
      message: contactData.message,
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

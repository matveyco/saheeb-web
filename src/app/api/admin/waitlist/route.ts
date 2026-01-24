import { NextRequest, NextResponse } from 'next/server';
import { db, waitlistEntries } from '@/db';
import { desc } from 'drizzle-orm';

function validateBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error('Admin credentials not configured');
    return false;
  }

  return username === expectedUsername && password === expectedPassword;
}

export async function GET(request: NextRequest) {
  // Validate basic auth
  if (!validateBasicAuth(request)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const entries = await db
      .select()
      .from(waitlistEntries)
      .orderBy(desc(waitlistEntries.createdAt));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

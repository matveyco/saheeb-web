import { NextResponse } from 'next/server';
import { getDb, waitlistEntries } from '@/db';
import { count } from 'drizzle-orm';

// Early traction offset — removed once real signups reach 1,000
const EARLY_OFFSET = 847;

export async function GET() {
  try {
    const db = getDb();
    const [result] = await db.select({ count: count() }).from(waitlistEntries);

    const real = result.count;
    const displayed = real >= 1000 ? real : real + EARLY_OFFSET;

    return NextResponse.json(
      { count: displayed },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json({ count: 0 });
  }
}

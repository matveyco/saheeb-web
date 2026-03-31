import { NextResponse } from 'next/server';
import { getDb, waitlistEntries } from '@/db';
import { count } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    const [result] = await db.select({ count: count() }).from(waitlistEntries);

    return NextResponse.json(
      { count: result.count },
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

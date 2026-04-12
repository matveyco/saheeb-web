import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(sql<{ count: number }>`
      select
        count(
          distinct coalesce(
            'email:' || lower(nullif(btrim(email), '')),
            'phone:' || nullif(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), '')
          )
        )::int as count
      from waitlist_entries
      where not (
        lower(coalesce(email, '')) like '%@example.com'
        or lower(coalesce(email, '')) like '%prod-smoke%'
        or lower(coalesce(name, '')) like '%prod-smoke%'
        or lower(coalesce(name, '')) like '%codex-smoke%'
      )
    `);
    const count = result.rows[0]?.count ?? 0;

    return NextResponse.json(
      { count },
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

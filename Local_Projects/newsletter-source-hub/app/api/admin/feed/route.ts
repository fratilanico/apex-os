import { NextRequest, NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { DigestData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Optional: add auth check if you want to strictly lock reading the feed
  // but public data is public.
  const authHeader = req.headers.get('x-admin-password');
  // const isAuthed = authHeader === process.env.ADMIN_PASSWORD;

  try {
    const data = await r2.fetchPublicJson<DigestData>('digest/latest.json');
    if (!data) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to proxy feed:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}

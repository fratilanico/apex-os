import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';

import { authOptions } from '@/lib/auth';
import { r2 } from '@/lib/r2';
import { DigestData } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface DigestRunSummary {
  run_id: string;
  generated_at: string;
  window_start: string;
  window_end: string;
  item_count: number;
  approved_count: number;
  pinned_count: number;
  rejected_count: number;
  new_count: number;
}

interface DraftSummary {
  draft_id: string;
  generated_at: string;
  section_count: number;
  item_count: number;
}

interface DashboardCounts {
  total: number;
  approved: number;
  pinned: number;
  rejected: number;
  new: number;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session ? null : await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [latest, runHistory, draftHistory] = await Promise.all([
      r2.getJson<DigestData>('digest/latest.json'),
      r2.getJson<{ runs: DigestRunSummary[] }>('digest/history/index.json'),
      r2.getJson<{ drafts: DraftSummary[] }>('draft/history/index.json'),
    ]);

    const counts: DashboardCounts = {
      total: 0,
      approved: 0,
      pinned: 0,
      rejected: 0,
      new: 0,
    };

    const sourceCounts = new Map<string, number>();
    if (latest?.items) {
      counts.total = latest.items.length;
      for (const item of latest.items) {
        if (item.status === 'approved') counts.approved += 1;
        if (item.status === 'pinned') counts.pinned += 1;
        if (item.status === 'rejected') counts.rejected += 1;
        if (item.status === 'new') counts.new += 1;

        const current = sourceCounts.get(item.source_name) ?? 0;
        sourceCounts.set(item.source_name, current + 1);
      }
    }

    const topSources = Array.from(sourceCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      latest: latest
        ? {
            run_id: latest.run_id,
            generated_at: latest.generated_at,
            window_start: latest.window_start,
            window_end: latest.window_end,
          }
        : null,
      counts,
      topSources,
      runs: runHistory?.runs ?? [],
      drafts: draftHistory?.drafts ?? [],
    });
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

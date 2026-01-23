import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_SOURCES } from '@/lib/constants';
import { processFeeds } from '@/lib/ingest';
import { r2 } from '@/lib/r2';
import { DigestData, Source } from '@/lib/types';
import crypto from 'crypto';

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

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60s for ingestion

export async function GET(request: NextRequest) {
  // 1. Security Check
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token'); 
  const isVercelCron = request.headers.get('x-vercel-cron') === '1';

  if (!isVercelCron && authHeader !== `Bearer ${process.env.CRON_TOKEN}` && token !== process.env.CRON_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Determine Window
    const now = new Date();
    const windowStart = new Date(now);
    windowStart.setDate(windowStart.getDate() - 5); // 5-day window to ensure content coverage

    // 3. Get Config (Try R2, fallback to default)
    let sources = await r2.getJson<Source[]>('config/sources.json');
    if (!sources) {
      sources = DEFAULT_SOURCES;
    }

    // 4. Ingest & Process
    const newItems = await processFeeds(sources, windowStart);
    
    // 5. Merge with existing "latest" (to preserve curated status if overlapping)
    const existingDigest = await r2.getJson<DigestData>('digest/latest.json');
    const existingItemsMap = new Map(existingDigest?.items.map(i => [i.id, i]));

    const mergedItems = newItems.map(item => {
      const existing = existingItemsMap.get(item.id);
      if (existing && existing.status !== 'new') {
        // Preserve curation status/notes
        return { ...item, status: existing.status, notes: existing.notes };
      }
      return item;
    });

    // Cap at top 60 items to keep JSON size manageable for frontend
    const cappedItems = mergedItems.slice(0, 60);

    const digestData: DigestData = {
      run_id: crypto.randomUUID(),
      generated_at: now.toISOString(),
      window_start: windowStart.toISOString(),
      window_end: now.toISOString(),
      sources: sources,
      items: cappedItems
    };

    const statusCounts = cappedItems.reduce(
      (acc, item) => {
        if (item.status === 'approved') acc.approved_count += 1;
        if (item.status === 'pinned') acc.pinned_count += 1;
        if (item.status === 'rejected') acc.rejected_count += 1;
        if (item.status === 'new') acc.new_count += 1;
        return acc;
      },
      {
        approved_count: 0,
        pinned_count: 0,
        rejected_count: 0,
        new_count: 0,
      }
    );

    const runSummary: DigestRunSummary = {
      run_id: digestData.run_id,
      generated_at: digestData.generated_at,
      window_start: digestData.window_start,
      window_end: digestData.window_end,
      item_count: cappedItems.length,
      approved_count: statusCounts.approved_count,
      pinned_count: statusCounts.pinned_count,
      rejected_count: statusCounts.rejected_count,
      new_count: statusCounts.new_count,
    };

    // 6. Save to R2
    // Save Latest
    await r2.uploadJson('digest/latest.json', digestData);
    
    // Save Archive
    const dateStr = now.toISOString().split('T')[0];
    await r2.uploadJson(`digest/archive/${dateStr}.json`, digestData);

    // Save History (keep last 30 runs)
    const historyKey = 'digest/history/index.json';
    const existingHistory = await r2.getJson<{ runs: DigestRunSummary[] }>(historyKey);
    const runs = existingHistory?.runs ?? [];
    const updatedRuns = [runSummary, ...runs].slice(0, 30);
    await r2.uploadJson(historyKey, { runs: updatedRuns });

    return NextResponse.json({ success: true, count: cappedItems.length, run_id: digestData.run_id });

  } catch (error: any) {
    console.error("Cron Job Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

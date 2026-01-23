import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";
import { r2 } from '@/lib/r2';
import { DigestData } from '@/lib/types';

// Simple REST-based Agent API (MCP-compatible structure)
// Agents can "GET" resources and "POST" to tools.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resource = searchParams.get('resource');

  // Resource: Latest Feed
  if (resource === 'feed/latest') {
    const data = await r2.fetchPublicJson<DigestData>('digest/latest.json');
    return NextResponse.json(data);
  }

  // Resource: Pending Items
  if (resource === 'feed/pending') {
    const data = await r2.fetchPublicJson<DigestData>('digest/latest.json');
    const pending = data?.items.filter(i => i.status === 'new') || [];
    return NextResponse.json(pending);
  }

  return NextResponse.json({ 
    available_resources: ["feed/latest", "feed/pending"],
    available_tools: ["curate_item", "refresh_feed"]
  });
}

export async function POST(req: NextRequest) {
  // Security Check
  const authHeader = req.headers.get('x-admin-password');
  if (authHeader !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const tool = body.tool;
  const args = body.args || {};

  // Tool: Curate Item
  if (tool === 'curate_item') {
    const { id, status, notes } = args;
    if (!id || !['approved', 'rejected', 'pinned', 'new'].includes(status)) {
      return NextResponse.json({ error: "Invalid arguments" }, { status: 400 });
    }

    const current = await r2.getJson<DigestData>('digest/latest.json');
    if (!current) return NextResponse.json({ error: "Feed not found" }, { status: 404 });

    let found = false;
    current.items = current.items.map(item => {
      if (item.id === id) {
        found = true;
        return { ...item, status, notes: notes || item.notes };
      }
      return item;
    });

    if (!found) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    await r2.uploadJson('digest/latest.json', current);
    return NextResponse.json({ success: true, message: `Item ${id} marked as ${status}` });
  }

  return NextResponse.json({ error: "Unknown tool" }, { status: 404 });
}

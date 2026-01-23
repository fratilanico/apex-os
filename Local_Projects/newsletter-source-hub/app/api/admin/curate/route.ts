import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';

import { authOptions } from '@/lib/auth';
import { r2 } from '@/lib/r2';
import { DigestData } from '@/lib/types';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session ? null : await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, sources } = body;

    // Fetch current to keep metadata
    const current = await r2.getJson<DigestData>('digest/latest.json');
    
    if (!current) {
      throw new Error("No digest found to update");
    }

    const updatedDigest: DigestData = {
      ...current,
      items: items || current.items,
      sources: sources || current.sources
    };

    await r2.uploadJson('digest/latest.json', updatedDigest);
    
    // Also save a specific curation checkpoint
    await r2.uploadJson('digest/curation/latest.json', updatedDigest);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';

import { authOptions } from '@/lib/auth';
import { r2 } from '@/lib/r2';
import { DigestItem, NewsletterDraft } from '@/lib/types';
import crypto from 'crypto';

export const maxDuration = 60;

interface GeneratedDigestItem {
  title: string;
  url: string;
  summary: string;
  takeaway: string;
}

interface GeneratedSection {
  title: string;
  items: GeneratedDigestItem[];
}

interface GeneratedDigest {
  sections: GeneratedSection[];
}

interface DraftSummary {
  draft_id: string;
  generated_at: string;
  section_count: number;
  item_count: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session ? null : await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items } = await req.json() as { items: DigestItem[] };
    
    // Filter only approved/pinned items
    const curationSet = items.filter(i => i.status === 'approved' || i.status === 'pinned');

    if (curationSet.length === 0) {
      return NextResponse.json({ error: "No approved items selected" }, { status: 400 });
    }

    // Prepare prompt
    const inputData = curationSet.map(i => ({
      title: i.title,
      url: i.url,
      source: i.source_name,
      topic: i.topics[0]
    }));

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'PERPLEXITY_API_KEY is not configured' }, { status: 500 });
    }
    
    const prompt = `
      You are an expert technical editor. Generate a developer newsletter digest from the provided list of articles.
      
      Input Data:
      ${JSON.stringify(inputData)}

      Instructions:
      1. Group items by topic: "AI & Machine Learning", "Python", "JavaScript ecosystem", "PHP & Backend", "DevOps & Tools".
      2. For each item, write a 1-sentence summary and a very short "Why it matters" or "Takeaway".
      3. Return ONLY a valid JSON object with this schema:
      {
        "sections": [
          {
            "title": "Section Name",
            "items": [
               { "title": "Article Title", "url": "original url", "summary": "The summary", "takeaway": "The takeaway" }
            ]
          }
        ]
      }
    `;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical editor. Respond only with valid JSON, no markdown.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Perplexity API error: ${response.status} ${errorBody}`);
    }

    const payload = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty response from Perplexity');

    const cleaned = text
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/, '')
      .trim();

    const parsed = JSON.parse(cleaned) as GeneratedDigest;

    // Generate simple HTML representation
    let html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">`;
    html += `<h1>Daily Tech Digest - ${new Date().toLocaleDateString()}</h1>`;
    
    parsed.sections.forEach((section) => {
      html += `<h2 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 8px;">${section.title}</h2>`;
      section.items.forEach((item) => {
        html += `<div style="margin-bottom: 24px;">`;
        html += `<h3 style="margin: 0 0 4px 0;"><a href="${item.url}" style="color: #111; text-decoration: none;">${item.title}</a></h3>`;
        html += `<p style="margin: 4px 0; font-size: 14px; line-height: 1.5;">${item.summary}</p>`;
        html += `<p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>Takeaway:</strong> ${item.takeaway}</p>`;
        html += `</div>`;
      });
    });
    html += `</div>`;

    const draft: NewsletterDraft = {
      generated_at: new Date().toISOString(),
      sections: parsed.sections,
      html_preview: html
    };

    // Save draft to R2
    await r2.uploadJson('draft/latest.json', draft);

    // Save draft history (keep last 30)
    const draftSummary: DraftSummary = {
      draft_id: crypto.randomUUID(),
      generated_at: draft.generated_at,
      section_count: draft.sections.length,
      item_count: draft.sections.reduce((count, section) => count + section.items.length, 0),
    };

    const historyKey = 'draft/history/index.json';
    const existingHistory = await r2.getJson<{ drafts: DraftSummary[] }>(historyKey);
    const drafts = existingHistory?.drafts ?? [];
    const updatedDrafts = [draftSummary, ...drafts].slice(0, 30);
    await r2.uploadJson(historyKey, { drafts: updatedDrafts });

    return NextResponse.json(draft);

  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

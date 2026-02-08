/**
 * APEX OS - Vertex AI Guide Generator
 * 
 * Uses Google's Gemini model to generate 3 teaching guides:
 * 1. HOW-TO GUIDE - Practical step-by-step
 * 2. PLAY GUIDE - Hands-on experimentation
 * 3. WHY THIS WORKS - Deep conceptual understanding
 */

import { VertexAI } from '@google-cloud/vertexai';

interface ContentPayload {
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt?: string;
  contentType?: string;
}

export interface GeneratedGuides {
  howTo: string;
  playGuide: string;
  whyThisWorks: string;
  suggestedTags: string[];
}

// Initialize Vertex AI
const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id',
  location: 'us-central1'
});

const SYSTEM_INSTRUCTIONS = `You are the teaching content engine for Nicolae-Gabriel Fratila's
developer education platform "Source Code."

Your audience: developers who want to stay ahead in AI, cloud
infrastructure, security, and modern web development.

When given a news story or technical article, you produce THREE
complementary teaching assets:

## 1. HOW-TO GUIDE
- Title: "How to [actionable skill from this content]"
- Context: Why this matters right now (1-2 sentences)
- Prerequisites: What the reader should know
- Steps: Numbered, practical, copy-paste ready where applicable
- Code examples if relevant
- Common mistakes to avoid
- Next steps

## 2. PLAY GUIDE
- Title: "Experiment: [hands-on challenge]"
- Objective: What the learner will build or discover
- Time estimate
- Setup requirements
- The challenge (structured as levels: Starter → Intermediate → Advanced)
- Reflection questions: "What did you notice when..."
- Share prompt: How to document and share their results

## 3. WHY THIS WORKS
- Title: "Behind the Scenes: [concept]"
- The surface-level takeaway (1 sentence)
- The deeper principle (mental model or framework)
- Historical context or pattern recognition ("This is the same pattern as...")
- Contrarian or non-obvious insight
- One question to think about

Rules:
- Be technically precise but accessible
- Always connect to practical developer workflows
- Reference specific tools, repos, or commands when possible
- Output clean markdown compatible with Notion
- Include suggested tags from: [AI, Cloud, Security, Web Dev,
  DevOps, Career, Open Source, LLMs, Infrastructure, Frontend, Backend]
- Each guide should work standalone but complement the others

Output format:
## GUIDE 1: HOW-TO
[content]

## GUIDE 2: PLAY
[content]

## GUIDE 3: WHY
[content]

## TAGS
[comma-separated list]`;

export async function generateGuides(payload: ContentPayload): Promise<GeneratedGuides> {
  try {
    const model = vertex.preview.getGenerativeModel({
      model: 'gemini-1.5-pro-002',
      systemInstruction: SYSTEM_INSTRUCTIONS,
    });

    const prompt = `
Generate all three teaching guides for this content:

**Title:** ${payload.title}
**Source:** ${payload.source}
**URL:** ${payload.url}
**Type:** ${payload.contentType || 'article'}
${payload.publishedAt ? `**Published:** ${payload.publishedAt}` : ''}

**Content:**
${payload.content.slice(0, 15000)} ${payload.content.length > 15000 ? '... [truncated]' : ''}

Please generate the three guides following the format specified in your instructions.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the response into structured guides
    const parsed = parseGuidesFromResponse(responseText);

    return parsed;

  } catch (error) {
    console.error('[Vertex AI] Generation error:', error);
    throw new Error(`Vertex AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseGuidesFromResponse(text: string): GeneratedGuides {
  const sections = text.split('## GUIDE');
  
  let howTo = '';
  let playGuide = '';
  let whyThisWorks = '';
  let suggestedTags: string[] = [];

  sections.forEach(section => {
    if (section.includes('1: HOW-TO')) {
      howTo = section.replace('1: HOW-TO', '').split('## GUIDE')[0].trim();
    } else if (section.includes('2: PLAY')) {
      playGuide = section.replace('2: PLAY', '').split('## GUIDE')[0].trim();
    } else if (section.includes('3: WHY')) {
      whyThisWorks = section.replace('3: WHY', '').split('## TAGS')[0].trim();
    }
  });

  // Extract tags
  const tagsMatch = text.match(/## TAGS\s*\n(.+)/i);
  if (tagsMatch) {
    suggestedTags = tagsMatch[1]
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return {
    howTo,
    playGuide,
    whyThisWorks,
    suggestedTags
  };
}

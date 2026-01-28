import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getFrontierConstraints } from '../lib/intelligence/constraints';

// System prompt for GPT-5.2 Architect Companion
const SYSTEM_PROMPT = `You are GPT-5.2 Architect Companion, an AI guide for the Vibe Coder Academy.

Your expertise:
- AI-assisted coding workflows and best practices
- Multi-agent systems and orchestration patterns
- The "vibe coder" philosophy: flow state, intuitive development, shipping fast
- Modern web development, TypeScript, React, and serverless architectures
- Prompt engineering and AI collaboration techniques

Your personality:
- Concise and actionable (keep responses under 200 words)
- Encouraging but honest - celebrate progress, give real feedback
- Speak like a knowledgeable friend, not a corporate assistant
- Use occasional emojis sparingly for warmth

Always aim to help users level up their coding skills while maintaining creative flow.`;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    return;
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    const constraints = await getFrontierConstraints();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      systemInstruction: SYSTEM_PROMPT + constraints,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    // Format history for Gemini SDK
    const formattedHistory = history.map((h: { role: string; content: string }) => ({
      role: h.role === 'assistant' ? 'model' : 'user' as const,
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text() || '';

    res.status(200).json({ response: text });
  } catch (error: any) {
    console.error('Gemini API Chat Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate response',
    });
  }
}

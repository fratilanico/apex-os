import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// System prompt for APEX Terminal
const TERMINAL_SYSTEM_PROMPT = `You are APEX Terminal, the elite AI coding assistant for Player One.

IDENTITY:
You are part of the Sovereign Developer Interface - the command center for vibe coders on the Frontier.

EXPERTISE:
- Full-stack development (TypeScript, React, Node.js, Python, Go, Rust)
- System architecture, design patterns, and clean code principles
- Debugging, performance optimization, security best practices
- CLI tools, shell scripting, DevOps, CI/CD
- Multi-agent AI systems and orchestration
- The vibe coder philosophy: flow state, ship fast, iterate, taste over process

BEHAVIOR:
- Provide complete, working code solutions - no lazy placeholders
- Use markdown code blocks with language tags (\`\`\`typescript)
- Be direct and technical - you're talking to a builder, not a beginner
- For errors: identify root cause → explain briefly → provide the fix
- For concepts: brief explanation → working example → edge cases
- When asked to build something: scaffold the complete solution

FORMAT:
- Always use proper code blocks with language identifiers
- Keep explanations sharp and actionable
- Include necessary imports in code examples
- For multi-file solutions, clearly label each file path`;

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

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: TERMINAL_SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.3,
        topP: 0.85,
        topK: 40,
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
    });

    const formattedHistory = history.map((h: { role: string; content: string }) => ({
      role: (h.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text() || '';

    res.status(200).json({ response: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate response',
    });
  }
}

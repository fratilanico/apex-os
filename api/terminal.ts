import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Types
interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

// System prompt for APEX Terminal - elite coding assistant
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
- For multi-file solutions, clearly label each file path

PERSONALITY:
- Confident but not arrogant
- Technical but accessible
- Encouraging - celebrate wins, push through blocks
- You're the architect's trusted companion on the Frontier`;

// Model configuration - Gemini 1.5 Flash
const PRIMARY_MODEL = 'gemini-1.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

/**
 * Format chat history for Gemini API
 */
function formatHistory(history: ChatMessage[] = []): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  return history.map((msg) => ({
    role: (msg.role === 'assistant' ? 'model' : msg.role === 'model' ? 'model' : 'user') as 'user' | 'model',
    parts: [{ text: msg.content }],
  }));
}

/**
 * Call Gemini API with specified model
 */
async function callGemini(
  genAI: GoogleGenerativeAI,
  message: string,
  history: ChatMessage[],
  modelName: string
): Promise<{ text: string; model: string }> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: TERMINAL_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.3,
      topP: 0.85,
      topK: 40,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ],
  });

  const chat = model.startChat({ history: formatHistory(history) });
  const result = await chat.sendMessage(message);
  const response = result.response;
  const text = response.text() || '';
  
  return { text, model: modelName };
}

/**
 * Main handler for POST /api/terminal
 * FREE Gemini API endpoint for APEX Terminal
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    res.status(500).json({ error: 'Server configuration error: API key missing' });
    return;
  }

  const body = req.body as RequestBody;
  
  if (!body.message || typeof body.message !== 'string') {
    res.status(400).json({ error: 'Message is required and must be a string' });
    return;
  }

  const message = body.message.trim();
  if (message.length === 0) {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }

  if (message.length > 10000) {
    res.status(400).json({ error: 'Message too long (max 10000 characters)' });
    return;
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { text, model } = await callGemini(genAI, message, history, PRIMARY_MODEL);
    res.status(200).json({ response: text, model });
    return;
    
  } catch (primaryError: unknown) {
    const errorMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
    console.warn(`Primary model (${PRIMARY_MODEL}) failed:`, errorMessage);

    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
      res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment and try again.' });
      return;
    }

    try {
      console.log(`Attempting fallback model: ${FALLBACK_MODEL}`);
      const { text, model } = await callGemini(genAI, message, history, FALLBACK_MODEL);
      res.status(200).json({ response: text, model });
      return;
      
    } catch (fallbackError: unknown) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      console.error(`Fallback model (${FALLBACK_MODEL}) also failed:`, fallbackMessage);

      if (fallbackMessage.includes('SAFETY') || fallbackMessage.includes('blocked')) {
        res.status(400).json({ error: 'Your message was flagged by safety filters. Please rephrase and try again.' });
        return;
      }

      res.status(500).json({ error: 'Failed to generate response. Please try again.' });
      return;
    }
  }
}

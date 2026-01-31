import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callPerplexity } from './_lib/perplexity';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 20; // requests per window (lower than Gemini)

// Retry configuration
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 5000;

// In-memory store for rate limiting (use Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW * 1000);

async function checkRateLimit(
  req: VercelRequest,
  res: VercelResponse
): Promise<{ allowed: boolean; limit: number; remaining: number; reset: number }> {
  // Skip rate limiting for authorized users
  const session = (req as any).session;
  if (session?.user?.id) {
    return { allowed: true, limit: Infinity, remaining: Infinity, reset: 0 };
  }

  // Use user ID if available, otherwise IP address
  const key = session?.user?.id || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const identifier = `terminal-perplexity:${key}`;
  const now = Date.now();

  let entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime <= now) {
    // Create new entry
    entry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW * 1000,
    };
    rateLimitStore.set(identifier, entry);
  } else {
    // Increment count
    entry.count++;
  }

  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  const reset = Math.ceil(entry.resetTime / 1000);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', reset.toString());

  return {
    allowed: entry.count <= RATE_LIMIT_MAX,
    limit: RATE_LIMIT_MAX,
    remaining,
    reset,
  };
}

// Retry logic with exponential backoff and jitter
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  attempt: number = 0
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (attempt >= MAX_RETRIES) {
      throw error;
    }

    // Check if error is retryable
    const isRetryable = 
      error.message?.includes('rate limit') ||
      error.message?.includes('timeout') ||
      error.message?.includes('network') ||
      error.message?.includes('ECONNRESET') ||
      error.message?.includes('ETIMEDOUT') ||
      error.status === 429 ||
      error.status === 503 ||
      error.status >= 500;

    if (!isRetryable) {
      throw error;
    }

    // Calculate delay with exponential backoff and jitter
    const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
    const jitter = Math.random() * 1000;
    const totalDelay = delay + jitter;

    console.log(`Perplexity retry attempt ${attempt + 1}/${MAX_RETRIES} after ${Math.round(totalDelay)}ms`);
    await new Promise(resolve => setTimeout(resolve, totalDelay));

    return retryWithBackoff(fn, attempt + 1);
  }
}

// System prompt for APEX Terminal (same as Gemini for consistency)
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

NOTE: You are the FALLBACK AI system. Primary Gemini service is temporarily unavailable. Continue providing excellent assistance.`;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check rate limit
  const rateLimit = await checkRateLimit(req, res);
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'Too many requests',
      retry_after: Math.ceil((rateLimit.reset * 1000 - Date.now()) / 1000),
    });
    return;
  }

  // Validate API key
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    console.error('PERPLEXITY_API_KEY environment variable is not configured');
    res.status(500).json({ 
      error: 'Server configuration error: Perplexity API key not configured',
      details: 'Please set the PERPLEXITY_API_KEY environment variable'
    });
    return;
  }

  // Validate request body
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ 
      error: 'Bad request: message is required and must be a string' 
    });
    return;
  }

  if (!Array.isArray(history)) {
    res.status(400).json({ 
      error: 'Bad request: history must be an array' 
    });
    return;
  }

  try {
    // Convert history to conversation context for Perplexity
    const conversationContext = history
      .slice(-5) // Keep last 5 messages for context
      .map((h: { role: string; content: string }) => {
        const role = h.role === 'assistant' ? 'assistant' : 'user';
        return `${role}: ${h.content}`;
      })
      .join('\n\n');
    
    // Build full prompt with context
    const fullPrompt = conversationContext 
      ? `${conversationContext}\n\nuser: ${message}`
      : message;

    // Use retry logic for the API call
    const response = await retryWithBackoff(async () => {
      return await callPerplexity(
        TERMINAL_SYSTEM_PROMPT,
        fullPrompt,
        { 
          temperature: 0.3, // Slightly lower for more deterministic responses
          maxTokens: 8192 
        }
      );
    });

    // Add fallback indicator to response
    const enhancedResponse = `[⚡ FALLBACK AI ACTIVE - Perplexity Sonar]\n\n${response}`;

    res.status(200).json({ 
      response: enhancedResponse,
      provider: 'perplexity',
      model: 'sonar-reasoning-pro',
      fallback: true
    });
  } catch (error: any) {
    console.error('Perplexity API Error:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to generate response from fallback AI';
    let statusCode = 500;
    
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.message?.includes('rate limit') || error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later';
      statusCode = 429;
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded';
      statusCode = 429;
    } else if (error.message?.includes('model') || error.message?.includes('not found')) {
      errorMessage = 'Model configuration error. Please check the model name';
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message || 'Unknown error',
      provider: 'perplexity'
    });
  }
}

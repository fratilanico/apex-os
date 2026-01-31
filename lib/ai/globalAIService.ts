import { callPerplexity } from './clients/perplexity';
import { callGemini } from './clients/gemini';
import { callGroq } from './clients/groq';
import { callCohere } from './clients/cohere';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  message: string;
  context?: string;
  history?: Message[];
  systemPrompt?: string;
  preferredProvider?: 'perplexity' | 'groq' | 'gemini' | 'cohere' | 'auto';
}

export interface AIResponse {
  content: string;
  provider: 'perplexity' | 'groq' | 'gemini' | 'cohere';
  model: string;
  latency: number;
  citations?: string[];
  cached?: boolean;
  tier: number; // 1-4 indicating which tier succeeded
}

interface CacheEntry {
  response: AIResponse;
  timestamp: number;
}

interface UsageMetrics {
  totalQueries: number;
  perplexityQueries: number;
  groqQueries: number;
  geminiQueries: number;
  cohereQueries: number;
  cachedQueries: number;
  averageLatency: number;
  errors: number;
  fallbackCount: number;
  lastReset: number;
}

interface RateLimitState {
  perplexity: { requests: number; windowStart: number };
  groq: { requests: number; windowStart: number };
  gemini: { requests: number; windowStart: number };
  cohere: { requests: number; windowStart: number };
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_RETRIES_PER_PROVIDER = 2;

// Rate limits per provider (requests per minute)
const RATE_LIMITS = {
  perplexity: 50,
  groq: 100, // Free tier: 100/min
  gemini: 60, // Free tier: 60/min
  cohere: 100, // Free tier: 100/min
};

// Provider tiers (priority order)
const PROVIDER_TIERS: Array<'perplexity' | 'groq' | 'gemini' | 'cohere'> = [
  'perplexity',
  'groq',
  'gemini',
  'cohere',
];

class GlobalAIService {
  private cache: Map<string, CacheEntry>;
  private usageMetrics: UsageMetrics;
  private rateLimits: RateLimitState;

  constructor() {
    this.cache = new Map();
    this.usageMetrics = {
      totalQueries: 0,
      perplexityQueries: 0,
      groqQueries: 0,
      geminiQueries: 0,
      cohereQueries: 0,
      cachedQueries: 0,
      averageLatency: 0,
      errors: 0,
      fallbackCount: 0,
      lastReset: Date.now(),
    };
    this.rateLimits = {
      perplexity: { requests: 0, windowStart: Date.now() },
      groq: { requests: 0, windowStart: Date.now() },
      gemini: { requests: 0, windowStart: Date.now() },
      cohere: { requests: 0, windowStart: Date.now() },
    };

    // Start cache cleanup interval
    setInterval(() => this.cleanupCache(), CACHE_TTL);
  }

  private generateCacheKey(request: AIRequest): string {
    const keyData = {
      message: request.message,
      context: request.context,
      systemPrompt: request.systemPrompt,
    };
    return JSON.stringify(keyData);
  }

  private getCachedResponse(key: string): AIResponse | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      this.usageMetrics.cachedQueries++;
      return { ...entry.response, cached: true };
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCachedResponse(key: string, response: AIResponse): void {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp >= CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  private checkRateLimit(provider: 'perplexity' | 'groq' | 'gemini' | 'cohere'): boolean {
    const now = Date.now();
    const limit = RATE_LIMITS[provider];
    const state = this.rateLimits[provider];

    if (now - state.windowStart >= RATE_LIMIT_WINDOW) {
      state.requests = 0;
      state.windowStart = now;
    }

    if (state.requests >= limit) {
      return false;
    }

    state.requests++;
    return true;
  }

  private stripCitations(content: string): string {
    // Remove citation markers like [1], [2], etc.
    return content.replace(/\[\d+\]/g, '').trim();
  }

  private updateMetrics(
    provider: 'perplexity' | 'groq' | 'gemini' | 'cohere',
    latency: number,
    success: boolean,
    isFallback: boolean
  ): void {
    this.usageMetrics.totalQueries++;

    switch (provider) {
      case 'perplexity':
        this.usageMetrics.perplexityQueries++;
        break;
      case 'groq':
        this.usageMetrics.groqQueries++;
        break;
      case 'gemini':
        this.usageMetrics.geminiQueries++;
        break;
      case 'cohere':
        this.usageMetrics.cohereQueries++;
        break;
    }

    if (!success) {
      this.usageMetrics.errors++;
    }

    if (isFallback) {
      this.usageMetrics.fallbackCount++;
    }

    // Update rolling average latency
    const currentAvg = this.usageMetrics.averageLatency;
    const totalQueries = this.usageMetrics.totalQueries;
    this.usageMetrics.averageLatency =
      (currentAvg * (totalQueries - 1) + latency) / totalQueries;
  }

  private async queryProvider(
    provider: 'perplexity' | 'groq' | 'gemini' | 'cohere',
    request: AIRequest,
    tier: number
  ): Promise<AIResponse> {
    if (!this.checkRateLimit(provider)) {
      throw new Error(`${provider} rate limit exceeded`);
    }

    const startTime = Date.now();

    try {
      let response: { content: string; citations?: string[] };

      switch (provider) {
        case 'perplexity':
          response = await callPerplexity({
            message: request.message,
            context: request.context,
            history: request.history,
            systemPrompt: request.systemPrompt,
            model: 'sonar-reasoning-pro',
          });
          break;

        case 'groq':
          response = await callGroq({
            message: request.message,
            context: request.context,
            history: request.history,
            systemPrompt: request.systemPrompt,
            model: 'llama-3.1-70b-versatile',
          });
          break;

        case 'gemini':
          response = await callGemini({
            message: request.message,
            context: request.context,
            history: request.history,
            systemPrompt: request.systemPrompt,
            model: 'gemini-1.5-flash',
          });
          break;

        case 'cohere':
          response = await callCohere({
            message: request.message,
            context: request.context,
            history: request.history,
            systemPrompt: request.systemPrompt,
            model: 'command-r',
          });
          break;
      }

      const latency = Date.now() - startTime;

      const aiResponse: AIResponse = {
        content: provider === 'perplexity' ? this.stripCitations(response.content) : response.content,
        provider,
        model: this.getModelName(provider),
        latency,
        citations: response.citations,
        cached: false,
        tier,
      };

      this.updateMetrics(provider, latency, true, tier > 1);
      this.logQuery(request, aiResponse, null);

      return aiResponse;
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updateMetrics(provider, latency, false, tier > 1);
      this.logQuery(request, null, error as Error);
      throw error;
    }
  }

  private getModelName(provider: 'perplexity' | 'groq' | 'gemini' | 'cohere'): string {
    switch (provider) {
      case 'perplexity':
        return 'sonar-reasoning-pro';
      case 'groq':
        return 'llama-3.1-70b-versatile';
      case 'gemini':
        return 'gemini-1.5-flash';
      case 'cohere':
        return 'command-r';
    }
  }

  private logQuery(request: AIRequest, response: AIResponse | null, error: Error | null): void {
    const logData = {
      timestamp: new Date().toISOString(),
      message: request.message.substring(0, 100) + (request.message.length > 100 ? '...' : ''),
      provider: response?.provider || 'failed',
      model: response?.model || 'none',
      latency: response?.latency || 0,
      cached: response?.cached || false,
      tier: response?.tier || 0,
      error: error ? error.message : null,
    };

    if (error) {
      console.error('[GlobalAIService] Query failed:', logData);
    } else {
      console.log('[GlobalAIService] Query completed:', logData);
    }
  }

  public async query(request: AIRequest): Promise<AIResponse> {
    // Check cache first
    const cacheKey = this.generateCacheKey(request);
    const cachedResponse = this.getCachedResponse(cacheKey);

    if (cachedResponse) {
      console.log('[GlobalAIService] Cache hit for query');
      return cachedResponse;
    }

    // Determine which provider to use
    const preferredProvider = request.preferredProvider || 'auto';

    // If specific provider is requested, try only that one
    if (preferredProvider !== 'auto' && PROVIDER_TIERS.includes(preferredProvider)) {
      try {
        const tier = PROVIDER_TIERS.indexOf(preferredProvider) + 1;
        const response = await this.queryProvider(preferredProvider, request, tier);
        this.setCachedResponse(cacheKey, response);
        return response;
      } catch (error) {
        console.error(`[GlobalAIService] ${preferredProvider} failed:`, (error as Error).message);
        throw new Error(`AI service unavailable. Please try again later.`);
      }
    }

    // Multi-tier fallback: Try each provider in order
    const errors: string[] = [];

    for (let i = 0; i < PROVIDER_TIERS.length; i++) {
      const provider = PROVIDER_TIERS[i] as 'perplexity' | 'groq' | 'gemini' | 'cohere';
      const tier = i + 1;

      // Try provider with retries
      for (let attempt = 0; attempt <= MAX_RETRIES_PER_PROVIDER; attempt++) {
        try {
          console.log(`[GlobalAIService] Trying ${provider} (tier ${tier}, attempt ${attempt + 1})`);
          const response = await this.queryProvider(provider, request, tier);
          this.setCachedResponse(cacheKey, response);

          if (tier > 1) {
            console.log(`[GlobalAIService] Fallback to tier ${tier} (${provider}) successful`);
          }

          return response;
        } catch (error) {
          const errorMsg = (error as Error).message;
          console.error(
            `[GlobalAIService] ${provider} attempt ${attempt + 1} failed:`,
            errorMsg
          );

          if (attempt < MAX_RETRIES_PER_PROVIDER) {
            // Exponential backoff: 500ms, 1000ms
            await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
          } else {
            errors.push(`${provider}: ${errorMsg}`);
          }
        }
      }
    }

    // All providers failed
    console.error('[GlobalAIService] All AI providers failed:', errors);
    throw new Error(
      'AI service temporarily unavailable. ' +
        'All providers (Perplexity, Groq, Gemini, Cohere) are experiencing issues. ' +
        'Please try again in a few moments.'
    );
  }

  public getMetrics(): UsageMetrics {
    return { ...this.usageMetrics };
  }

  public resetMetrics(): void {
    this.usageMetrics = {
      totalQueries: 0,
      perplexityQueries: 0,
      groqQueries: 0,
      geminiQueries: 0,
      cohereQueries: 0,
      cachedQueries: 0,
      averageLatency: 0,
      errors: 0,
      fallbackCount: 0,
      lastReset: Date.now(),
    };
  }

  public getCacheStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
    };
  }

  public clearCache(): void {
    this.cache.clear();
    console.log('[GlobalAIService] Cache cleared');
  }

  public getProviderStatus(): Array<{
    provider: string;
    available: boolean;
    requestsInWindow: number;
    limit: number;
  }> {
    const now = Date.now();
    return PROVIDER_TIERS.map((provider) => {
      const state = this.rateLimits[provider];
      const isWindowActive = now - state.windowStart < RATE_LIMIT_WINDOW;
      return {
        provider,
        available: isWindowActive ? state.requests < RATE_LIMITS[provider] : true,
        requestsInWindow: isWindowActive ? state.requests : 0,
        limit: RATE_LIMITS[provider],
      };
    });
  }
}

// Export singleton instance
const globalAIService = new GlobalAIService();

export async function queryAI(request: AIRequest): Promise<AIResponse> {
  return globalAIService.query(request);
}

export function getAIMetrics(): UsageMetrics {
  return globalAIService.getMetrics();
}

export function resetAIMetrics(): void {
  globalAIService.resetMetrics();
}

export function getAICacheStats(): { size: number; entries: number } {
  return globalAIService.getCacheStats();
}

export function clearAICache(): void {
  globalAIService.clearCache();
}

export function getAIProviderStatus(): Array<{
  provider: string;
  available: boolean;
  requestsInWindow: number;
  limit: number;
}> {
  return globalAIService.getProviderStatus();
}

export default globalAIService;

/**
 * Global AI Service - Routes to server-side API endpoints
 *
 * This service calls /api/terminal (Gemini) as the primary provider.
 * All AI calls go through server-side API routes to protect API keys.
 */

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
  tier: number;
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

const CACHE_TTL = 5 * 60 * 1000;
const API_TIMEOUT = 30000;
const MAX_RETRIES = 2;

class GlobalAIService {
  private cache: Map<string, CacheEntry>;
  private usageMetrics: UsageMetrics;

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

    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanupCache(), CACHE_TTL);
    }
  }

  private generateCacheKey(request: AIRequest): string {
    return JSON.stringify({
      message: request.message,
      context: request.context,
      systemPrompt: request.systemPrompt,
    });
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
    this.cache.set(key, { response, timestamp: Date.now() });
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp >= CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  private updateMetrics(provider: AIResponse['provider'], latency: number, success: boolean): void {
    this.usageMetrics.totalQueries++;
    this.usageMetrics[`${provider}Queries` as keyof UsageMetrics] =
      (this.usageMetrics[`${provider}Queries` as keyof UsageMetrics] as number || 0) + 1;

    if (!success) {
      this.usageMetrics.errors++;
    }

    const currentAvg = this.usageMetrics.averageLatency;
    const total = this.usageMetrics.totalQueries;
    this.usageMetrics.averageLatency = (currentAvg * (total - 1) + latency) / total;
  }

  private async callTerminalAPI(request: AIRequest, retryCount = 0): Promise<AIResponse> {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const history = request.history?.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        content: msg.content,
      })) || [];

      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: request.message, history }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');

        if (response.status >= 500 && retryCount < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
          return this.callTerminalAPI(request, retryCount + 1);
        }

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }

        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      const aiResponse: AIResponse = {
        content: data.response || data.content || '',
        provider: 'gemini',
        model: data.model || 'gemini-3-flash',
        latency,
        cached: false,
        tier: 1,
      };

      this.updateMetrics('gemini', latency, true);
      return aiResponse;

    } catch (error: unknown) {
      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      this.updateMetrics('gemini', latency, false);

      const errorMessage = error instanceof Error ? error.message : String(error);

      if (
        (errorMessage.includes('abort') || errorMessage.includes('network') || errorMessage.includes('fetch')) &&
        retryCount < MAX_RETRIES
      ) {
        await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
        return this.callTerminalAPI(request, retryCount + 1);
      }

      throw new Error(errorMessage);
    }
  }

  public async query(request: AIRequest): Promise<AIResponse> {
    const cacheKey = this.generateCacheKey(request);
    const cachedResponse = this.getCachedResponse(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await this.callTerminalAPI(request);
      this.setCachedResponse(cacheKey, response);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`AI service temporarily unavailable. ${errorMessage}`);
    }
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
    return { size: this.cache.size, entries: this.cache.size };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getProviderStatus(): Array<{
    provider: string;
    available: boolean;
    requestsInWindow: number;
    limit: number;
  }> {
    return [{ provider: 'gemini', available: true, requestsInWindow: 0, limit: 60 }];
  }
}

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

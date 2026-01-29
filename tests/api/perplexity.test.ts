import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Dynamic import to allow mocking
let callPerplexity: typeof import('../../api/_lib/perplexity').callPerplexity;

describe('callPerplexity', () => {
  beforeEach(async () => {
    vi.resetModules();
    mockFetch.mockReset();
    // Set API key for tests
    process.env.PERPLEXITY_API_KEY = 'test-api-key';
    // Re-import to get fresh module
    const module = await import('../../api/_lib/perplexity');
    callPerplexity = module.callPerplexity;
  });

  afterEach(() => {
    delete process.env.PERPLEXITY_API_KEY;
  });

  it('should throw error if PERPLEXITY_API_KEY is missing', async () => {
    delete process.env.PERPLEXITY_API_KEY;
    const module = await import('../../api/_lib/perplexity');

    await expect(
      module.callPerplexity('system', 'user')
    ).rejects.toThrow('PERPLEXITY_API_KEY missing');
  });

  it('should make POST request to Perplexity API with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test response' } }]
      })
    });

    await callPerplexity('System prompt', 'User prompt');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.perplexity.ai/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    );

    const requestInit = mockFetch.mock.calls[0]?.[1];
    if (!requestInit || typeof requestInit !== 'object' || !('body' in requestInit)) {
      throw new Error('Missing request body');
    }
    const body = JSON.parse(String(requestInit.body));
    expect(body).toEqual({
      model: 'sonar-reasoning-pro',
      messages: [
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'User prompt' },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });
  });

  it('should use custom temperature and maxTokens when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test response' } }]
      })
    });

    await callPerplexity('System', 'User', { temperature: 0.8, maxTokens: 2048 });

    const requestInit = mockFetch.mock.calls[0]?.[1];
    if (!requestInit || typeof requestInit !== 'object' || !('body' in requestInit)) {
      throw new Error('Missing request body');
    }
    const body = JSON.parse(String(requestInit.body));
    expect(body.temperature).toBe(0.8);
    expect(body.max_tokens).toBe(2048);
  });

  it('should return message content from API response', async () => {
    const expectedContent = 'This is the AI response with search results';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: expectedContent } }]
      })
    });

    const result = await callPerplexity('System', 'User');

    expect(result).toBe(expectedContent);
  });

  it('should throw error on non-200 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Rate limit exceeded'
    });

    await expect(
      callPerplexity('System', 'User')
    ).rejects.toThrow('Perplexity API Error: Rate limit exceeded');
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      callPerplexity('System', 'User')
    ).rejects.toThrow('Network error');
  });
});

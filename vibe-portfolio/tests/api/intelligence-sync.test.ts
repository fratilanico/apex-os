import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}));

vi.mock('../../lib/server/gemini', () => ({
  callGemini: vi.fn()
}));

vi.mock('../../lib/server/perplexity', () => ({
  callPerplexity: vi.fn()
}));

import { supabase } from '../../lib/supabase';
import { callGemini } from '../../lib/server/gemini';
import { callPerplexity } from '../../lib/server/perplexity';

// Import handler after mocks
import handler from '../../api/intelligence/sync';

// Mock request/response
function createMockReq(method: string = 'POST') {
  return { method } as any;
}

function createMockRes() {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
}

describe('Intelligence Sync Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject non-POST/GET methods', async () => {
    const req = createMockReq('DELETE');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should call Perplexity then Gemini in sequence', async () => {
    const mockResearchData = 'Research about emerging AI tools...';
    const mockDraftedItems = JSON.stringify([
      {
        title: 'Test Tool',
        category: 'AI',
        description: 'A test tool',
        logic: 'Use it for testing',
        tags: ['test'],
        source_url: 'https://example.com'
      }
    ]);

    vi.mocked(callPerplexity).mockResolvedValue(mockResearchData);
    vi.mocked(callGemini).mockResolvedValue(mockDraftedItems);

    // Mock Supabase - no existing items
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({ data: null })
      })
    });
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: '123', title: 'Test Tool' },
          error: null
        })
      })
    });
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'frontier_intelligence') {
        return { select: mockSelect, insert: mockInsert } as any;
      }
      return {} as any;
    });

    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    // Verify Perplexity was called first
    expect(callPerplexity).toHaveBeenCalledWith(
      expect.stringContaining('Frontier Scout'),
      expect.stringContaining('emerging AI coding tools')
    );

    // Verify Gemini was called with research data
    expect(callGemini).toHaveBeenCalledWith(
      expect.stringContaining('APEX Frontier Scout'),
      expect.stringContaining(mockResearchData),
      { jsonMode: true, temperature: 0.2 }
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should skip duplicate items by title', async () => {
    const mockDraftedItems = JSON.stringify([
      { title: 'Existing Tool', category: 'AI', description: 'desc', logic: 'logic', tags: [] },
      { title: 'New Tool', category: 'Frontend', description: 'desc', logic: 'logic', tags: [] }
    ]);

    vi.mocked(callPerplexity).mockResolvedValue('research');
    vi.mocked(callGemini).mockResolvedValue(mockDraftedItems);

    // Mock: first item exists, second doesn't
    const mockMaybeSingle = vi.fn()
      .mockResolvedValueOnce({ data: { id: 'existing' } }) // Existing Tool found
      .mockResolvedValueOnce({ data: null }); // New Tool not found

    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'new-id', title: 'New Tool' },
      error: null
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: mockMaybeSingle
        })
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockSingle
        })
      })
    } as any);

    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    // Should only insert 1 item (the new one)
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.processed).toBe(2);
    expect(responseData.new_items).toBe(1);
  });

  it('should handle Perplexity API errors', async () => {
    vi.mocked(callPerplexity).mockRejectedValue(new Error('Perplexity rate limit'));

    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Perplexity rate limit'
    });
  });

  it('should handle Gemini JSON parse errors', async () => {
    vi.mocked(callPerplexity).mockResolvedValue('research data');
    vi.mocked(callGemini).mockResolvedValue('invalid json {{{');

    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should return research summary truncated to 500 chars', async () => {
    const longResearch = 'A'.repeat(1000);
    vi.mocked(callPerplexity).mockResolvedValue(longResearch);
    vi.mocked(callGemini).mockResolvedValue('[]');

    const req = createMockReq('POST');
    const res = createMockRes();

    await handler(req, res);

    const responseData = res.json.mock.calls[0][0];
    expect(responseData.research_summary.length).toBeLessThanOrEqual(504); // 500 + '...'
  });
});

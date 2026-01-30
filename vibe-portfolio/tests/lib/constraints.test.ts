import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  }
}));

import { supabase } from '../../lib/supabase';
import { getFrontierConstraints } from '../../lib/intelligence/constraints';

describe('getFrontierConstraints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty string when no data', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    } as any);

    const result = await getFrontierConstraints();

    // Empty array still produces header but no items
    expect(result).toContain('FRONTIER_KNOWLEDGE_CONSTRAINTS');
  });

  it('should return empty string on error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') })
    } as any);

    const result = await getFrontierConstraints();

    expect(result).toBe('');
  });

  it('should generate restricted section for inactive items', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          { title: 'Old Tool', category: 'Backend', logic: 'Use X', is_active: false },
        ],
        error: null
      })
    } as any);

    const result = await getFrontierConstraints();

    expect(result).toContain('RESTRICTED_TOOLS_AND_LOGIC');
    expect(result).toContain('Old Tool (Backend)');
    expect(result).toContain('User has disabled this sync');
  });

  it('should generate authorized section for active items', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          { title: 'New AI Tool', category: 'AI', logic: 'Use streaming API for real-time', is_active: true },
        ],
        error: null
      })
    } as any);

    const result = await getFrontierConstraints();

    expect(result).toContain('AUTHORIZED_FRONTIER_KNOWLEDGE');
    expect(result).toContain('New AI Tool');
    expect(result).toContain('Use streaming API for real-time');
  });

  it('should handle mixed active and inactive items', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [
          { title: 'Active Tool', category: 'Frontend', logic: 'Use React 19', is_active: true },
          { title: 'Disabled Tool', category: 'Backend', logic: 'Old approach', is_active: false },
          { title: 'Another Active', category: 'AI', logic: 'Use Gemini 3', is_active: true },
        ],
        error: null
      })
    } as any);

    const result = await getFrontierConstraints();

    // Should have both sections
    expect(result).toContain('RESTRICTED_TOOLS_AND_LOGIC');
    expect(result).toContain('AUTHORIZED_FRONTIER_KNOWLEDGE');

    // Active items in authorized
    expect(result).toContain('Active Tool: Use React 19');
    expect(result).toContain('Another Active: Use Gemini 3');

    // Inactive in restricted
    expect(result).toContain('Disabled Tool (Backend)');
  });

  it('should query correct table and fields', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect
    } as any);

    await getFrontierConstraints();

    expect(supabase.from).toHaveBeenCalledWith('frontier_intelligence');
    expect(mockSelect).toHaveBeenCalledWith('title, category, logic, is_active');
  });
});

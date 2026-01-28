/**
 * Client-side knowledge store for ingested sources and search results.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IngestionSource {
  id: string;
  source_type: string;
  source_url?: string;
  title?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunk_count: number;
  error_message?: string;
  created_at: string;
}

interface SearchResult {
  chunk_id: string;
  content: string;
  source_id: string;
  source_title?: string;
  source_type?: string;
  similarity: number;
}

interface RLMStats {
  totalLearnings: number;
  agentScores: Record<string, number>;
  bestAgent: { agentId: string; avgScore: number } | null;
  lastUpdated: number;
}

interface KnowledgeState {
  sources: IngestionSource[];
  isIngesting: boolean;
  ingestError: string | null;
  searchResults: SearchResult[];
  isSearching: boolean;
  lastQuery: string;
  rlmStats: RLMStats | null;

  addSource: (source: IngestionSource) => void;
  updateSource: (id: string, updates: Partial<IngestionSource>) => void;
  removeSource: (id: string) => void;
  setIngesting: (val: boolean) => void;
  setIngestError: (err: string | null) => void;
  setSearchResults: (results: SearchResult[], query: string) => void;
  setSearching: (val: boolean) => void;
  setRLMStats: (stats: RLMStats) => void;
  reset: () => void;
}

const initialState = {
  sources: [] as IngestionSource[],
  isIngesting: false,
  ingestError: null as string | null,
  searchResults: [] as SearchResult[],
  isSearching: false,
  lastQuery: '',
  rlmStats: null as RLMStats | null,
};

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set) => ({
      ...initialState,
      addSource: (source) => set((s) => ({ sources: [source, ...s.sources] })),
      updateSource: (id, updates) => set((s) => ({
        sources: s.sources.map((src) => src.id === id ? { ...src, ...updates } : src),
      })),
      removeSource: (id) => set((s) => ({ sources: s.sources.filter((src) => src.id !== id) })),
      setIngesting: (val) => set({ isIngesting: val }),
      setIngestError: (err) => set({ ingestError: err }),
      setSearchResults: (results, query) => set({ searchResults: results, lastQuery: query, isSearching: false }),
      setSearching: (val) => set({ isSearching: val }),
      setRLMStats: (stats) => set({ rlmStats: stats }),
      reset: () => set(initialState),
    }),
    {
      name: 'apex-knowledge-store',
      partialize: (state: KnowledgeState) => ({
        sources: state.sources,
        rlmStats: state.rlmStats,
      }),
    }
  )
);

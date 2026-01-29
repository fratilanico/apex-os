import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { modules as fallbackModules } from '../data/curriculumData';
import type { Module } from '../types/curriculum';

interface CurriculumState {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: number | null;
  loadModules: () => Promise<void>;
  setModules: (modules: Module[]) => void;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set) => ({
      modules: fallbackModules,
      isLoading: false,
      error: null,
      lastSyncedAt: null,
      setModules: (modules) => set({ modules }),
      loadModules: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/curriculum/modules');
          if (!res.ok) {
            throw new Error(`Failed to load curriculum: ${res.status}`);
          }
          const data = await res.json();
          if (Array.isArray(data.modules) && data.modules.length > 0) {
            set({ modules: data.modules, lastSyncedAt: Date.now() });
          } else {
            set({ modules: fallbackModules, lastSyncedAt: Date.now() });
          }
        } catch (error) {
          set({
            modules: fallbackModules,
            error: error instanceof Error ? error.message : 'Failed to load curriculum',
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'apex-curriculum-cache',
      version: 1,
      partialize: (state) => ({
        modules: state.modules,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);

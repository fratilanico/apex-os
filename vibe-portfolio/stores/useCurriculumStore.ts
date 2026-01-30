import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { modules as fallbackModules } from '../data/curriculumData';
import type { Module } from '../types/curriculum';

export type SectionStatus = 'not-started' | 'in-progress' | 'completed';

export interface SectionProgress {
  sectionId: string;
  status: SectionStatus;
  completedAt: number | null;
}

export interface ModuleProgress {
  moduleId: string;
  sections: Record<string, SectionProgress>;
  startedAt: number | null;
  completedAt: number | null;
}

export interface CurriculumState {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: number | null;
  progress: Record<string, ModuleProgress>;
  loadModules: () => Promise<void>;
  setModules: (modules: Module[]) => void;
  getModuleProgress: (moduleId: string) => number;
  getSectionStatus: (sectionId: string) => SectionStatus;
  completeSection: (sectionId: string) => void;
  getOverallProgress: () => number;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set, get) => ({
      modules: fallbackModules,
      isLoading: false,
      error: null,
      lastSyncedAt: null,
      progress: {},
      
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
      
      getModuleProgress: (moduleId: string) => {
        const state = get();
        const module = state.modules.find(m => m.id === moduleId);
        const moduleProgress = state.progress[moduleId];
        
        if (!module || !moduleProgress) return 0;
        
        const completedSections = Object.values(moduleProgress.sections).filter(
          s => s.status === 'completed'
        ).length;
        
        return Math.round((completedSections / module.sections.length) * 100);
      },
      
      getSectionStatus: (sectionId: string) => {
        const state = get();
        for (const moduleProgress of Object.values(state.progress)) {
          if (moduleProgress.sections[sectionId]) {
            return moduleProgress.sections[sectionId].status;
          }
        }
        return 'not-started';
      },
      
      completeSection: (sectionId: string) => {
        set((state) => {
          // Find which module this section belongs to
          const module = state.modules.find(m => 
            m.sections.some(s => s.id === sectionId)
          );
          
          if (!module) return state;
          
          const moduleProgress = state.progress[module.id] || {
            moduleId: module.id,
            sections: {},
            startedAt: Date.now(),
            completedAt: null,
          };
          
          const updatedSections = {
            ...moduleProgress.sections,
            [sectionId]: {
              sectionId,
              status: 'completed' as SectionStatus,
              completedAt: Date.now(),
            },
          };
          
          // Check if all sections are completed
          const allCompleted = module.sections.every(s => 
            updatedSections[s.id]?.status === 'completed'
          );
          
          return {
            progress: {
              ...state.progress,
              [module.id]: {
                ...moduleProgress,
                sections: updatedSections,
                completedAt: allCompleted ? Date.now() : moduleProgress.completedAt,
              },
            },
          };
        });
      },
      
      getOverallProgress: () => {
        const state = get();
        let totalSections = 0;
        let completedSections = 0;
        
        state.modules.forEach(module => {
          totalSections += module.sections.length;
          const moduleProgress = state.progress[module.id];
          if (moduleProgress) {
            completedSections += Object.values(moduleProgress.sections).filter(
              s => s.status === 'completed'
            ).length;
          }
        });
        
        return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
      },
    }),
    {
      name: 'vibe-curriculum-storage',
      version: 1,
      partialize: (state) => ({
        modules: state.modules,
        lastSyncedAt: state.lastSyncedAt,
        progress: state.progress,
      }),
    }
  )
);

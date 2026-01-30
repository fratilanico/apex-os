import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workflow, WorkflowCategory } from '../types/workflow';
import { workflowsData } from '../data/workflowsData';

interface WorkflowProgress {
  mastered: boolean;
  practiceCount: number;
  lastPracticed?: string;
}

interface WorkflowState {
  workflows: Workflow[];
  progress: Record<string, WorkflowProgress>;
  bookmarks: string[];
  activeWorkflowId: string | null;

  // Actions
  markPracticed: (id: string) => void;
  markMastered: (id: string) => void;
  toggleBookmark: (id: string) => void;
  setActiveWorkflow: (id: string | null) => void;

  // Computed
  getByCategory: (cat: WorkflowCategory) => Workflow[];
  getMasteredCount: () => number;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      workflows: workflowsData,
      progress: {},
      bookmarks: [],
      activeWorkflowId: null,

      markPracticed: (id: string) => {
        set((state) => {
          const current = state.progress[id] || { mastered: false, practiceCount: 0 };
          return {
            progress: {
              ...state.progress,
              [id]: {
                ...current,
                practiceCount: current.practiceCount + 1,
                lastPracticed: new Date().toISOString()
              }
            }
          };
        });
      },

      markMastered: (id: string) => {
        set((state) => {
          const current = state.progress[id] || { mastered: false, practiceCount: 0 };
          return {
            progress: {
              ...state.progress,
              [id]: {
                ...current,
                mastered: true
              }
            }
          };
        });
      },

      toggleBookmark: (id: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.includes(id)
            ? state.bookmarks.filter((b) => b !== id)
            : [...state.bookmarks, id]
        }));
      },

      setActiveWorkflow: (id: string | null) => {
        set({ activeWorkflowId: id });
      },

      getByCategory: (cat: WorkflowCategory) => {
        return get().workflows.filter((w) => w.category === cat);
      },

      getMasteredCount: () => {
        return Object.values(get().progress).filter((p) => p.mastered).length;
      }
    }),
    {
      name: 'apex-workflow-storage',
      partialize: (state) => ({
        progress: state.progress,
        bookmarks: state.bookmarks
      })
    }
  )
);

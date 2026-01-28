import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StoryState,
  StoryDecision,
  Cutscene,
  LoreFragment,
  Act,
  EndingType,
  StoryProgress,
} from '../types/story';

interface StoryStoreState extends StoryState {
  // Story data registry
  cutscenes: Record<string, Cutscene>;
  loreFragments: Record<string, LoreFragment>;
  
  // Actions
  advanceAct: (act: Act) => void;
  advanceChapter: () => void;
  recordDecision: (decision: Omit<StoryDecision, 'timestamp'>) => void;
  setPlotFlag: (flag: string, value: boolean) => void;
  discoverLore: (loreId: string) => void;
  completeCutscene: (cutsceneId: string) => void;
  setEnding: (ending: EndingType) => void;
  
  // Queries
  hasPlotFlag: (flag: string) => boolean;
  isLoreDiscovered: (loreId: string) => boolean;
  isCutsceneCompleted: (cutsceneId: string) => boolean;
  getProgress: () => StoryProgress;
  getAvailableCutscenes: () => Cutscene[];
  getLoreByCategory: (category: string) => LoreFragment[];
  
  // Data management
  registerCutscene: (cutscene: Cutscene) => void;
  registerLore: (lore: LoreFragment) => void;
  loadCutscenes: (cutscenes: Cutscene[]) => void;
  loadLore: (lore: LoreFragment[]) => void;
  
  // Reset
  resetStory: () => void;
}

export const useStoryStore = create<StoryStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentAct: 1,
      currentChapter: 1,
      majorDecisions: [],
      discoveredLore: [],
      plotFlags: {},
      ending: null,
      completedCutscenes: [],
      cutscenes: {},
      loreFragments: {},
      
      // Actions
      advanceAct: (act: Act) => {
        set({ currentAct: act, currentChapter: 1 });
      },
      
      advanceChapter: () => {
        set((state) => ({
          currentChapter: state.currentChapter + 1,
        }));
      },
      
      recordDecision: (decision) => {
        const fullDecision: StoryDecision = {
          ...decision,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          majorDecisions: [...state.majorDecisions, fullDecision],
        }));
        
        // Set story flags if any
        if (decision.affectedStoryFlags) {
          const newFlags = decision.affectedStoryFlags.reduce((acc, flag) => {
            acc[flag] = true;
            return acc;
          }, {} as Record<string, boolean>);
          
          set((state) => ({
            plotFlags: {
              ...state.plotFlags,
              ...newFlags,
            },
          }));
        }
      },
      
      setPlotFlag: (flag: string, value: boolean) => {
        set((state) => ({
          plotFlags: {
            ...state.plotFlags,
            [flag]: value,
          },
        }));
      },
      
      discoverLore: (loreId: string) => {
        const { discoveredLore, loreFragments } = get();
        
        if (discoveredLore.includes(loreId)) return;
        
        const lore = loreFragments[loreId];
        if (!lore) {
          console.warn(`Lore fragment not found: ${loreId}`);
          return;
        }
        
        set({
          discoveredLore: [...discoveredLore, loreId],
          loreFragments: {
            ...loreFragments,
            [loreId]: {
              ...lore,
              discoveredAt: new Date().toISOString(),
            },
          },
        });
      },
      
      completeCutscene: (cutsceneId: string) => {
        const { completedCutscenes, cutscenes } = get();
        
        if (completedCutscenes.includes(cutsceneId)) return;
        
        const cutscene = cutscenes[cutsceneId];
        if (!cutscene) return;
        
        set({
          completedCutscenes: [...completedCutscenes, cutsceneId],
        });
        
        // Apply cutscene effects
        if (cutscene.onComplete) {
          const { setFlags } = cutscene.onComplete;
          if (setFlags) {
            set((state) => ({
              plotFlags: {
                ...state.plotFlags,
                ...setFlags,
              },
            }));
          }
        }
      },
      
      setEnding: (ending: EndingType) => {
        set({ ending });
      },
      
      // Queries
      hasPlotFlag: (flag: string) => {
        return get().plotFlags[flag] === true;
      },
      
      isLoreDiscovered: (loreId: string) => {
        return get().discoveredLore.includes(loreId);
      },
      
      isCutsceneCompleted: (cutsceneId: string) => {
        return get().completedCutscenes.includes(cutsceneId);
      },
      
      getProgress: () => {
        const { currentAct, currentChapter, discoveredLore, loreFragments, ending } = get();
        
        const totalLore = Object.keys(loreFragments).length;
        
        const actProgress: Record<Act, { started: boolean; completed: boolean; chaptersCompleted: number }> = {
          1: { started: true, completed: currentAct > 1, chaptersCompleted: currentAct > 1 ? 999 : currentChapter },
          2: { started: currentAct >= 2, completed: currentAct > 2, chaptersCompleted: currentAct === 2 ? currentChapter : (currentAct > 2 ? 999 : 0) },
          3: { started: currentAct >= 3, completed: currentAct > 3, chaptersCompleted: currentAct === 3 ? currentChapter : (currentAct > 3 ? 999 : 0) },
          4: { started: currentAct >= 4, completed: ending !== null, chaptersCompleted: currentAct === 4 ? currentChapter : 0 },
        };
        
        return {
          currentAct,
          currentChapter,
          actProgress,
          decisionsCount: get().majorDecisions.length,
          loreCollected: discoveredLore.length,
          totalLore,
          endingAchieved: ending,
        };
      },
      
      getAvailableCutscenes: () => {
        const { cutscenes, completedCutscenes } = get();
        
        return Object.values(cutscenes).filter(
          (cutscene) => !completedCutscenes.includes(cutscene.id)
        );
      },
      
      getLoreByCategory: (category: string) => {
        const { loreFragments, discoveredLore } = get();
        
        return Object.values(loreFragments).filter(
          (lore) => lore.category === category && discoveredLore.includes(lore.id)
        );
      },
      
      // Data Management
      registerCutscene: (cutscene: Cutscene) => {
        set((state) => ({
          cutscenes: {
            ...state.cutscenes,
            [cutscene.id]: cutscene,
          },
        }));
      },
      
      registerLore: (lore: LoreFragment) => {
        set((state) => ({
          loreFragments: {
            ...state.loreFragments,
            [lore.id]: lore,
          },
        }));
      },
      
      loadCutscenes: (cutscenes: Cutscene[]) => {
        const cutsceneMap = cutscenes.reduce((acc, cutscene) => {
          acc[cutscene.id] = cutscene;
          return acc;
        }, {} as Record<string, Cutscene>);
        
        set({ cutscenes: cutsceneMap });
      },
      
      loadLore: (lore: LoreFragment[]) => {
        const loreMap = lore.reduce((acc, fragment) => {
          acc[fragment.id] = fragment;
          return acc;
        }, {} as Record<string, LoreFragment>);
        
        set({ loreFragments: loreMap });
      },
      
      // Reset
      resetStory: () => {
        set({
          currentAct: 1,
          currentChapter: 1,
          majorDecisions: [],
          discoveredLore: [],
          plotFlags: {},
          ending: null,
          completedCutscenes: [],
        });
      },
    }),
    {
      name: 'apex-story-storage',
      version: 1,
      partialize: (state) => ({
        currentAct: state.currentAct,
        currentChapter: state.currentChapter,
        majorDecisions: state.majorDecisions,
        discoveredLore: state.discoveredLore,
        plotFlags: state.plotFlags,
        ending: state.ending,
        completedCutscenes: state.completedCutscenes,
        // Don't persist cutscenes/lore data - loaded from content files
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Academy view types (for navigation state)
 */
export type AcademyView = 'dashboard' | 'module' | 'section';

/**
 * Display mode types (for UI presentation)
 */
export type DisplayMode = 'grid' | 'terminal';

/**
 * Module progress tracking
 */
export interface ModuleProgress {
  moduleId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
}

/**
 * Section view tracking
 */
export interface SectionView {
  sectionId: string;
  moduleId: string;
  viewedAt: string;
  timeSpent: number; // in seconds
}

/**
 * Academy store state interface
 */
interface AcademyState {
  // State
  currentView: AcademyView;
  displayMode: DisplayMode;
  selectedModuleId: string | null;
  selectedSectionId: string | null;
  modulesStarted: ModuleProgress[];
  modulesCompleted: string[];
  sectionsViewed: SectionView[];
  timeSpentPerModule: Record<string, number>; // moduleId -> seconds
  lastActiveDate: string | null;

  // Actions
  setView: (view: DisplayMode) => void;
  setNavigationView: (view: AcademyView) => void;
  selectModule: (moduleId: string | null) => void;
  selectSection: (sectionId: string | null, moduleId?: string) => void;
  markModuleStarted: (moduleId: string) => void;
  markModuleComplete: (moduleId: string) => void;
  trackTime: (moduleId: string, seconds: number) => void;
  trackSectionView: (sectionId: string, moduleId: string, timeSpent: number) => void;
  updateLastActive: () => void;

  // Computed helpers
  isModuleStarted: (moduleId: string) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  isSectionViewed: (sectionId: string) => boolean;
  getModuleProgress: (moduleId: string) => ModuleProgress | null;
  getTotalTimeSpent: () => number;
}

/**
 * Academy store with persistence
 * Manages learning progress, navigation, and time tracking
 */
export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: 'dashboard',
      displayMode: 'grid',
      selectedModuleId: null,
      selectedSectionId: null,
      modulesStarted: [],
      modulesCompleted: [],
      sectionsViewed: [],
      timeSpentPerModule: {},
      lastActiveDate: null,

      // Actions
      setView: (view: DisplayMode) => {
        set({ displayMode: view });
        get().updateLastActive();
      },

      setNavigationView: (view: AcademyView) => {
        set({ currentView: view });
        get().updateLastActive();
      },

      selectModule: (moduleId: string | null) => {
        set({
          selectedModuleId: moduleId,
          currentView: moduleId ? 'module' : 'dashboard',
        });
        
        // Mark module as started if not already
        if (moduleId && !get().isModuleStarted(moduleId)) {
          get().markModuleStarted(moduleId);
        }
        
        get().updateLastActive();
      },

      selectSection: (sectionId: string | null, moduleId?: string) => {
        set({
          selectedSectionId: sectionId,
          currentView: sectionId ? 'section' : 'module',
        });
        
        // Update selected module if provided
        if (moduleId && get().selectedModuleId !== moduleId) {
          set({ selectedModuleId: moduleId });
        }
        
        get().updateLastActive();
      },

      markModuleStarted: (moduleId: string) => {
        const { modulesStarted } = get();
        
        // Don't add if already started
        if (modulesStarted.some(m => m.moduleId === moduleId)) {
          return;
        }
        
        const newProgress: ModuleProgress = {
          moduleId,
          startedAt: new Date().toISOString(),
          timeSpent: 0,
        };
        
        set({
          modulesStarted: [...modulesStarted, newProgress],
        });
      },

      markModuleComplete: (moduleId: string) => {
        const { modulesCompleted, modulesStarted } = get();
        
        // Don't add if already completed
        if (modulesCompleted.includes(moduleId)) {
          return;
        }
        
        // Update the module progress with completion date
        const updatedProgress = modulesStarted.map(m =>
          m.moduleId === moduleId
            ? { ...m, completedAt: new Date().toISOString() }
            : m
        );
        
        set({
          modulesCompleted: [...modulesCompleted, moduleId],
          modulesStarted: updatedProgress,
        });
        
        get().updateLastActive();
      },

      trackTime: (moduleId: string, seconds: number) => {
        const { timeSpentPerModule, modulesStarted } = get();
        
        // Update time spent record
        const currentTime = timeSpentPerModule[moduleId] ?? 0;
        const updatedTime = currentTime + seconds;
        
        // Update module progress
        const updatedProgress = modulesStarted.map(m =>
          m.moduleId === moduleId
            ? { ...m, timeSpent: m.timeSpent + seconds }
            : m
        );
        
        set({
          timeSpentPerModule: {
            ...timeSpentPerModule,
            [moduleId]: updatedTime,
          },
          modulesStarted: updatedProgress,
        });
      },

      trackSectionView: (sectionId: string, moduleId: string, timeSpent: number) => {
        const { sectionsViewed } = get();
        
        // Check if section already viewed
        const existingViewIndex = sectionsViewed.findIndex(
          s => s.sectionId === sectionId && s.moduleId === moduleId
        );
        
        if (existingViewIndex >= 0) {
          // Update existing view
          const updatedViews = [...sectionsViewed];
          const existingView = updatedViews[existingViewIndex];
          if (existingView) {
            updatedViews[existingViewIndex] = {
              sectionId: existingView.sectionId,
              moduleId: existingView.moduleId,
              viewedAt: new Date().toISOString(),
              timeSpent: existingView.timeSpent + timeSpent,
            };
            set({ sectionsViewed: updatedViews });
          }
        } else {
          // Add new view
          const newView: SectionView = {
            sectionId,
            moduleId,
            viewedAt: new Date().toISOString(),
            timeSpent,
          };
          set({ sectionsViewed: [...sectionsViewed, newView] });
        }
      },

      updateLastActive: () => {
        set({ lastActiveDate: new Date().toISOString() });
      },

      // Computed helpers
      isModuleStarted: (moduleId: string) => {
        return get().modulesStarted.some(m => m.moduleId === moduleId);
      },

      isModuleCompleted: (moduleId: string) => {
        return get().modulesCompleted.includes(moduleId);
      },

      isSectionViewed: (sectionId: string) => {
        return get().sectionsViewed.some(s => s.sectionId === sectionId);
      },

      getModuleProgress: (moduleId: string) => {
        return get().modulesStarted.find(m => m.moduleId === moduleId) ?? null;
      },

      getTotalTimeSpent: () => {
        const { timeSpentPerModule } = get();
        return Object.values(timeSpentPerModule).reduce((sum, time) => sum + time, 0);
      },
    }),
    {
      name: 'vibe-academy-storage',
      version: 1,
      // Persist all state except computed helpers
      partialize: (state) => ({
        currentView: state.currentView,
        displayMode: state.displayMode,
        selectedModuleId: state.selectedModuleId,
        selectedSectionId: state.selectedSectionId,
        modulesStarted: state.modulesStarted,
        modulesCompleted: state.modulesCompleted,
        sectionsViewed: state.sectionsViewed,
        timeSpentPerModule: state.timeSpentPerModule,
        lastActiveDate: state.lastActiveDate,
      }),
    }
  )
);

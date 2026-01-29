import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAIN_QUESTS, type Quest } from '../data/questsData';

/**
 * Skill progress tracking
 */
export interface SkillProgress {
  skillId: string;
  progress: number; // 0-100
  unlockedAt: string;
  lastUpdated: string;
}

/**
 * Skill prerequisite definition
 */
export interface SkillPrerequisite {
  skillId: string;
  requiredProgress?: number; // Minimum progress required (default 100)
}

/**
 * Skill definition with XP requirements
 */
export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  prerequisites: SkillPrerequisite[];
  tier: number; // 1, 2, 3 etc. for visual grouping
}

/**
 * Skill tree store state interface
 */
interface SkillTreeState {
  // State
  unlockedSkills: string[];
  skillProgress: SkillProgress[];
  currentXP: number;
  gold: number; // Compute Credits
  activeQuestId: string | null;
  completedQuests: string[];
  narrativeContext: string;
  dmLogs: string[];

  // Actions
  unlockSkill: (skillId: string) => void;
  updateProgress: (skillId: string, progress: number) => void;
  setCurrentXP: (xp: number) => void;
  addGold: (amount: number) => void;
  setActiveQuest: (questId: string | null) => void;
  completeQuest: (questId: string) => void;
  setNarrative: (context: string) => void;
  addDMLog: (log: string) => void;
  canUnlock: (
    skillId: string,
    skillDef: SkillDefinition
  ) => { canUnlock: boolean; reason?: string };

  // Computed helpers
  isSkillUnlocked: (skillId: string) => boolean;
  isQuestCompleted: (questId: string) => boolean;
  getSkillProgress: (skillId: string) => SkillProgress | null;
  getActiveQuest: () => Quest | null;
  getAvailableQuests: () => Quest[];
  getUnlockedSkillsCount: () => number;
  getTotalProgress: () => number;
}

/**
 * Skill tree store with XP integration
 * Manages skill unlocking and progress tracking
 */
export const useSkillTreeStore = create<SkillTreeState>()(
  persist(
    (set, get) => ({
      // Initial state
      unlockedSkills: [],
      skillProgress: [],
      currentXP: 0,
      gold: 0,
      activeQuestId: null,
      completedQuests: [],
      narrativeContext: 'Welcome to the Frontier, Player One.',
      dmLogs: [],

      // Actions
      unlockSkill: (skillId: string) => {
        const { unlockedSkills, skillProgress, addDMLog } = get();

        // Don't unlock if already unlocked
        if (unlockedSkills.includes(skillId)) {
          return;
        }

        const newProgress: SkillProgress = {
          skillId,
          progress: 0,
          unlockedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        addDMLog(`NEW SKILL UNLOCKED: ${skillId}`);

        set({
          unlockedSkills: [...unlockedSkills, skillId],
          skillProgress: [...skillProgress, newProgress],
        });
      },

      updateProgress: (skillId: string, progress: number) => {
        const { skillProgress, isSkillUnlocked } = get();

        // Only update if skill is unlocked
        if (!isSkillUnlocked(skillId)) {
          console.warn(`Cannot update progress for locked skill: ${skillId}`);
          return;
        }

        // Clamp progress between 0 and 100
        const clampedProgress = Math.max(0, Math.min(100, progress));

        const updatedProgress = skillProgress.map((sp) =>
          sp.skillId === skillId
            ? {
                ...sp,
                progress: clampedProgress,
                lastUpdated: new Date().toISOString(),
              }
            : sp
        );

        set({ skillProgress: updatedProgress });
      },

      setCurrentXP: (xp: number) => {
        set({ currentXP: Math.max(0, xp) });
      },

      addGold: (amount: number) => {
        set((state) => ({ gold: state.gold + amount }));
      },

      setActiveQuest: (questId: string | null) => {
        const quest = MAIN_QUESTS.find(q => q.id === questId);
        if (quest) {
          get().addDMLog(`QUEST INITIATED: ${quest.title}`);
          get().setNarrative(quest.narrative);
        }
        set({ activeQuestId: questId });
      },

      completeQuest: (questId: string) => {
        const { completedQuests, activeQuestId, addGold, setCurrentXP, addDMLog, unlockedSkills, unlockSkill } = get();
        
        if (completedQuests.includes(questId)) return;

        const quest = MAIN_QUESTS.find(q => q.id === questId);
        if (!quest) return;

        addDMLog(`QUEST COMPLETED: ${quest.title}`);
        addDMLog(`REWARDS: +${quest.xpReward} XP // +${quest.goldReward} GOLD`);

        // Update XP and Gold
        setCurrentXP(get().currentXP + quest.xpReward);
        addGold(quest.goldReward);

        // Unlock associated skills
        quest.skillsUnlocked.forEach(skillId => {
          if (!unlockedSkills.includes(skillId)) {
            unlockSkill(skillId);
          }
        });

        set({
          completedQuests: [...completedQuests, questId],
          activeQuestId: activeQuestId === questId ? null : activeQuestId,
        });
      },

      setNarrative: (context: string) => {
        set({ narrativeContext: context });
      },

      addDMLog: (log: string) => {
        set((state) => ({ dmLogs: [...state.dmLogs.slice(-19), log] })); // Keep last 20 logs
      },

      canUnlock: (skillId: string, skillDef: SkillDefinition) => {
        const { isSkillUnlocked, getSkillProgress, currentXP } = get();

        // Already unlocked
        if (isSkillUnlocked(skillId)) {
          return { canUnlock: false, reason: 'Already unlocked' };
        }

        // Check XP requirement
        if (currentXP < skillDef.xpRequired) {
          return {
            canUnlock: false,
            reason: `Requires ${skillDef.xpRequired} XP (current: ${currentXP})`,
          };
        }

        // Check prerequisites
        for (const prereq of skillDef.prerequisites) {
          const prereqProgress = getSkillProgress(prereq.skillId);

          // Prerequisite not unlocked
          if (!prereqProgress) {
            return {
              canUnlock: false,
              reason: `Prerequisite skill not unlocked: ${prereq.skillId}`,
            };
          }

          // Check progress requirement
          const requiredProgress = prereq.requiredProgress ?? 100;
          if (prereqProgress.progress < requiredProgress) {
            return {
              canUnlock: false,
              reason: `Prerequisite ${prereq.skillId} requires ${requiredProgress}% progress (current: ${prereqProgress.progress}%)`,
            };
          }
        }

        return { canUnlock: true };
      },

      // Computed helpers
      isSkillUnlocked: (skillId: string) => {
        return get().unlockedSkills.includes(skillId);
      },

      isQuestCompleted: (questId: string) => {
        return get().completedQuests.includes(questId);
      },

      getSkillProgress: (skillId: string) => {
        return get().skillProgress.find((sp) => sp.skillId === skillId) ?? null;
      },

      getActiveQuest: () => {
        const { activeQuestId } = get();
        return MAIN_QUESTS.find(q => q.id === activeQuestId) ?? null;
      },

      getAvailableQuests: () => {
        const { completedQuests } = get();
        return MAIN_QUESTS.filter(q => 
          !completedQuests.includes(q.id) && 
          q.prerequisites.every(pr => completedQuests.includes(pr))
        );
      },

      getUnlockedSkillsCount: () => {
        return get().unlockedSkills.length;
      },

      getTotalProgress: () => {
        const { skillProgress } = get();

        if (skillProgress.length === 0) {
          return 0;
        }

        const totalProgress = skillProgress.reduce(
          (sum, sp) => sum + sp.progress,
          0
        );
        return totalProgress / skillProgress.length;
      },
    }),
    {
      name: 'vibe-skills-storage',
      version: 1,
      // Persist skill data, XP, and Narrative state
      partialize: (state) => ({
        unlockedSkills: state.unlockedSkills,
        skillProgress: state.skillProgress,
        currentXP: state.currentXP,
        gold: state.gold,
        activeQuestId: state.activeQuestId,
        completedQuests: state.completedQuests,
        narrativeContext: state.narrativeContext,
        dmLogs: state.dmLogs,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Achievement,
  AchievementProgress,
  AchievementNotification,
  AchievementStats,
  AchievementCategory,
  AchievementRarity,
} from '../types/achievement';

interface AchievementStoreState {
  // State
  achievements: Record<string, Achievement>;
  unlockedAchievements: string[];
  achievementProgress: Record<string, AchievementProgress>;
  notificationQueue: AchievementNotification[];
  
  // Actions
  unlockAchievement: (achievementId: string) => boolean;
  updateProgress: (achievementId: string, progress: number) => void;
  incrementProgress: (achievementId: string, amount?: number) => void;
  checkAchievement: (achievementId: string) => boolean;
  dismissNotification: (achievementId: string) => void;
  clearNotifications: () => void;
  
  // Queries
  isUnlocked: (achievementId: string) => boolean;
  getProgress: (achievementId: string) => AchievementProgress | null;
  getStats: () => AchievementStats;
  getUnlockedByCategory: (category: AchievementCategory) => Achievement[];
  getUnlockedByRarity: (rarity: AchievementRarity) => Achievement[];
  getPendingNotifications: () => AchievementNotification[];
  
  // Data management
  registerAchievement: (achievement: Achievement) => void;
  loadAchievements: (achievements: Achievement[]) => void;
}

export const useAchievementStore = create<AchievementStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      achievements: {},
      unlockedAchievements: [],
      achievementProgress: {},
      notificationQueue: [],
      
      // Actions
      unlockAchievement: (achievementId: string) => {
        const { achievements, unlockedAchievements } = get();
        
        if (unlockedAchievements.includes(achievementId)) {
          return false; // Already unlocked
        }
        
        const achievement = achievements[achievementId];
        if (!achievement) {
          console.warn(`Achievement not found: ${achievementId}`);
          return false;
        }
        
        const now = new Date().toISOString();
        
        // Unlock the achievement
        set({
          unlockedAchievements: [...unlockedAchievements, achievementId],
          achievements: {
            ...achievements,
            [achievementId]: {
              ...achievement,
              unlockedAt: now,
            },
          },
          notificationQueue: [
            ...get().notificationQueue,
            {
              achievement: {
                ...achievement,
                unlockedAt: now,
              },
              timestamp: now,
              shown: false,
            },
          ],
        });
        
        return true;
      },
      
      updateProgress: (achievementId: string, progress: number) => {
        const { achievements, achievementProgress } = get();
        const achievement = achievements[achievementId];
        
        if (!achievement || !achievement.maxProgress) return;
        
        const clampedProgress = Math.max(0, Math.min(achievement.maxProgress, progress));
        const percentage = (clampedProgress / achievement.maxProgress) * 100;
        
        set({
          achievementProgress: {
            ...achievementProgress,
            [achievementId]: {
              achievementId,
              current: clampedProgress,
              total: achievement.maxProgress,
              percentage,
              unlocked: get().isUnlocked(achievementId),
            },
          },
        });
        
        // Auto-unlock if progress reaches 100%
        if (clampedProgress >= achievement.maxProgress) {
          get().unlockAchievement(achievementId);
        }
      },
      
      incrementProgress: (achievementId: string, amount: number = 1) => {
        const currentProgress = get().achievementProgress[achievementId];
        const newProgress = (currentProgress?.current ?? 0) + amount;
        get().updateProgress(achievementId, newProgress);
      },
      
      checkAchievement: (achievementId: string) => {
        const { achievements, isUnlocked } = get();
        const achievement = achievements[achievementId];
        
        if (!achievement || isUnlocked(achievementId)) return false;
        
        // TODO: Implement condition checking logic
        // For now, return false (will be checked by game logic)
        return false;
      },
      
      dismissNotification: (achievementId: string) => {
        set({
          notificationQueue: get().notificationQueue.map(n =>
            n.achievement.id === achievementId ? { ...n, shown: true } : n
          ),
        });
      },
      
      clearNotifications: () => {
        set({
          notificationQueue: get().notificationQueue.filter(n => !n.shown),
        });
      },
      
      // Queries
      isUnlocked: (achievementId: string) => {
        return get().unlockedAchievements.includes(achievementId);
      },
      
      getProgress: (achievementId: string) => {
        return get().achievementProgress[achievementId] ?? null;
      },
      
      getStats: () => {
        const { achievements, unlockedAchievements } = get();
        const allAchievements = Object.values(achievements);
        
        const totalAchievements = allAchievements.length;
        const unlockedCount = unlockedAchievements.length;
        const completionPercentage = totalAchievements > 0
          ? (unlockedCount / totalAchievements) * 100
          : 0;
        
        // By category
        const byCategory = allAchievements.reduce((acc, achievement) => {
          if (!acc[achievement.category]) {
            acc[achievement.category] = { total: 0, unlocked: 0 };
          }
          acc[achievement.category].total++;
          if (unlockedAchievements.includes(achievement.id)) {
            acc[achievement.category].unlocked++;
          }
          return acc;
        }, {} as Record<AchievementCategory, { total: number; unlocked: number }>);
        
        // By rarity
        const byRarity = allAchievements.reduce((acc, achievement) => {
          if (!acc[achievement.rarity]) {
            acc[achievement.rarity] = { total: 0, unlocked: 0 };
          }
          acc[achievement.rarity].total++;
          if (unlockedAchievements.includes(achievement.id)) {
            acc[achievement.rarity].unlocked++;
          }
          return acc;
        }, {} as Record<AchievementRarity, { total: number; unlocked: number }>);
        
        // Total XP and Gold earned
        const rewards = allAchievements
          .filter(a => unlockedAchievements.includes(a.id))
          .reduce(
            (acc, a) => ({
              xp: acc.xp + a.xpReward,
              gold: acc.gold + (a.goldReward ?? 0),
            }),
            { xp: 0, gold: 0 }
          );
        
        return {
          totalAchievements,
          unlockedAchievements: unlockedCount,
          completionPercentage,
          byCategory,
          byRarity,
          totalXPEarned: rewards.xp,
          totalGoldEarned: rewards.gold,
        };
      },
      
      getUnlockedByCategory: (category: AchievementCategory) => {
        const { achievements, unlockedAchievements } = get();
        return Object.values(achievements).filter(
          a => a.category === category && unlockedAchievements.includes(a.id)
        );
      },
      
      getUnlockedByRarity: (rarity: AchievementRarity) => {
        const { achievements, unlockedAchievements } = get();
        return Object.values(achievements).filter(
          a => a.rarity === rarity && unlockedAchievements.includes(a.id)
        );
      },
      
      getPendingNotifications: () => {
        return get().notificationQueue.filter(n => !n.shown);
      },
      
      // Data Management
      registerAchievement: (achievement: Achievement) => {
        set((state) => ({
          achievements: {
            ...state.achievements,
            [achievement.id]: achievement,
          },
        }));
      },
      
      loadAchievements: (achievements: Achievement[]) => {
        const achievementMap = achievements.reduce((acc, achievement) => {
          acc[achievement.id] = achievement;
          return acc;
        }, {} as Record<string, Achievement>);
        
        set({ achievements: achievementMap });
      },
    }),
    {
      name: 'apex-achievement-storage',
      version: 1,
      partialize: (state) => ({
        unlockedAchievements: state.unlockedAchievements,
        achievementProgress: state.achievementProgress,
        // Don't persist achievements data - loaded from content files
        // Don't persist notifications - session only
      }),
    }
  )
);

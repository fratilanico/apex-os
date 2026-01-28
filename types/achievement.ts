/**
 * Achievement System Type Definitions
 * 
 * Defines achievements to:
 * - Celebrate player accomplishments
 * - Drive completionist behavior
 * - Reward exploration and mastery
 * - Track progress across all game systems
 */

export type AchievementCategory =
  | 'story'       // Main quest progress
  | 'mastery'     // Skill-based achievements
  | 'speed'       // Time-based challenges
  | 'discovery'   // Finding secrets
  | 'social'      // Sharing/referrals
  | 'collection'  // Collecting everything
  | 'challenge'   // Optional hard modes
  | 'boss'        // Boss-specific
  | 'npc';        // NPC relationship

export type AchievementRarity =
  | 'common'      // 40%+ of players unlock
  | 'uncommon'    // 20-40% of players
  | 'rare'        // 5-20% of players
  | 'epic'        // 1-5% of players
  | 'legendary';  // <1% of players

export type AchievementConditionType =
  | 'quest_complete'
  | 'boss_defeat'
  | 'level_reach'
  | 'npc_max_relationship'
  | 'speed_clear'
  | 'no_hints'
  | 'no_deaths'
  | 'collect_all'
  | 'custom';

export interface AchievementCondition {
  type: AchievementConditionType;
  value?: string | number;
  counter?: number;
  metadata?: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  goldReward?: number;
  hidden: boolean;
  condition: AchievementCondition;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  total: number;
  percentage: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementNotification {
  achievement: Achievement;
  timestamp: string;
  shown: boolean;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  completionPercentage: number;
  byCategory: Record<AchievementCategory, {
    total: number;
    unlocked: number;
  }>;
  byRarity: Record<AchievementRarity, {
    total: number;
    unlocked: number;
  }>;
  totalXPEarned: number;
  totalGoldEarned: number;
}

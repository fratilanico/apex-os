'use client';

import { useCallback, useMemo } from 'react';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';

/**
 * Level configuration with title and XP threshold
 */
export interface LevelConfig {
  level: number;
  title: string;
  xpRequired: number;
}

/**
 * Level definitions - ordered by XP requirement
 */
export const LEVELS: LevelConfig[] = [
  { level: 0, title: 'Script Kiddie', xpRequired: 0 },
  { level: 1, title: 'Junior Dev', xpRequired: 100 },
  { level: 2, title: 'Mid Engineer', xpRequired: 500 },
  { level: 3, title: 'Senior', xpRequired: 1500 },
  { level: 4, title: '10x Engineer', xpRequired: 5000 },
  { level: 5, title: 'Apex Architect', xpRequired: 10000 },
];

/**
 * Get level from XP amount
 */
function calculateLevel(xp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const level = LEVELS[i];
    if (level && xp >= level.xpRequired) {
      return level.level;
    }
  }
  return 0;
}

/**
 * Get level configuration by level number
 */
function getLevelConfig(level: number): LevelConfig {
  const found = LEVELS.find((l) => l.level === level);
  if (!found) {
    return LEVELS[0] ?? { level: 0, title: 'Script Kiddie', xpRequired: 0 };
  }
  return found;
}

/**
 * Custom hook for XP management, synchronized with SkillTreeStore
 */
export function useXP() {
  const { currentXP, setCurrentXP, addDMLog, setNarrative } = useSkillTreeStore();

  const currentLevel = useMemo(() => calculateLevel(currentXP), [currentXP]);
  
  const currentLevelTitle = useMemo(() => getLevelConfig(currentLevel).title, [currentLevel]);

  const nextLevel = useMemo(() => 
    LEVELS.find((l) => l.level === currentLevel + 1) ?? null, 
  [currentLevel]);

  const xpToNextLevel = useMemo(() => {
    if (!nextLevel) return 0;
    return nextLevel.xpRequired - currentXP;
  }, [currentXP, nextLevel]);

  const isMaxLevel = currentLevel >= LEVELS[LEVELS.length - 1]!.level;

  /**
   * Add XP and return true if level up occurred
   */
  const addXP = useCallback((amount: number, reason?: string): boolean => {
    if (amount <= 0) return false;

    const oldLevel = calculateLevel(currentXP);
    const newXP = currentXP + amount;
    const newLevel = calculateLevel(newXP);
    
    setCurrentXP(newXP);

    if (reason) {
      addDMLog(`XP GAINED: +${amount} // ${reason}`);
    }

    if (newLevel > oldLevel) {
      const newTitle = getLevelConfig(newLevel).title;
      addDMLog(`LEVEL UP! You have ascended to: ${newTitle}`);
      setNarrative(`The system acknowledges your growth. New architectural pathways are becoming visible.`);
      return true;
    }

    return false;
  }, [currentXP, setCurrentXP, addDMLog, setNarrative]);

  /**
   * Get progress percentage to next level
   */
  const progressPercentage = useCallback((): number => {
    if (isMaxLevel) return 100;
    
    const currentLevelConfig = getLevelConfig(currentLevel);
    const nextLevelConfig = nextLevel;
    
    if (!nextLevelConfig) return 100;
    
    const xpInCurrentLevel = currentXP - currentLevelConfig.xpRequired;
    const xpNeededForLevel = nextLevelConfig.xpRequired - currentLevelConfig.xpRequired;
    
    if (xpNeededForLevel === 0) return 100;
    
    return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));
  }, [currentXP, currentLevel, isMaxLevel, nextLevel]);

  return {
    currentXP,
    currentLevel,
    currentLevelTitle,
    xpToNextLevel,
    nextLevel,
    isMaxLevel,
    addXP,
    progressPercentage,
    levels: LEVELS,
  };
}

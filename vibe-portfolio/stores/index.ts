/**
 * Vibe Portfolio - Zustand State Management
 * 
 * Centralized exports for all application stores.
 * Each store is persisted to localStorage with versioning support.
 */

// Auth Store
export { useAuthStore } from './useAuthStore';
export type { AuthUser, AuthMethod } from './useAuthStore';

// Academy Store
export { useAcademyStore } from './useAcademyStore';
export type {
  AcademyView,
  ModuleProgress,
  SectionView,
} from './useAcademyStore';

// Skill Tree Store
export { useSkillTreeStore } from './useSkillTreeStore';
export type {
  SkillProgress,
  SkillPrerequisite,
  SkillDefinition,
} from './useSkillTreeStore';

// Quiz Store
export { useQuizStore } from './useQuizStore';
export type {
  QuestionType,
  QuizQuestion,
  Quiz,
  QuizAnswer,
  QuizSubmission,
  ActiveQuizSession,
} from './useQuizStore';

// Curriculum Store
export { useCurriculumStore } from './useCurriculumStore';
export type {
  CurriculumState,
  SectionStatus,
} from './useCurriculumStore';

/**
 * Store reset utility
 * Clears all persisted state from localStorage
 */
export const resetAllStores = () => {
  const storeKeys = [
    'vibe-auth-storage',
    'vibe-academy-storage',
    'vibe-skills-storage',
    'vibe-quiz-storage',
    'vibe-curriculum-storage',
  ];

  storeKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Reload to reinitialize stores
  window.location.reload();
};

/**
 * Store version migration helper
 * Can be extended to handle version migrations in the future
 */
export const getStoreVersion = (storeName: string): number => {
  const stored = localStorage.getItem(storeName);
  if (!stored) return 0;

  try {
    const parsed = JSON.parse(stored);
    return parsed.version ?? 0;
  } catch {
    return 0;
  }
};

# Store Exports Reference

Quick reference for all available imports from `@/stores`.

## 🏪 Store Hooks

```typescript
import {
  useAuthStore,      // Authentication store
  useAcademyStore,   // Learning progress store
  useSkillTreeStore, // Skill tree & XP store
  useQuizStore,      // Quiz system store
} from '@/stores';
```

## 📦 Type Exports

### Auth Store Types
```typescript
import type {
  AuthUser,          // User data interface
  AuthMethod,        // 'email' | 'github' | 'demo' | 'cli'
} from '@/stores';
```

### Academy Store Types
```typescript
import type {
  AcademyView,       // 'dashboard' | 'module' | 'section'
  ModuleProgress,    // Module progress tracking
  SectionView,       // Section view history
} from '@/stores';
```

### Skill Tree Store Types
```typescript
import type {
  SkillProgress,      // Skill progress tracking
  SkillPrerequisite,  // Prerequisite definition
  SkillDefinition,    // Complete skill definition
} from '@/stores';
```

### Quiz Store Types
```typescript
import type {
  QuestionType,       // 'multiple-choice' | 'true-false' | 'code-snippet'
  QuizQuestion,       // Question definition
  Quiz,               // Complete quiz definition
  QuizAnswer,         // User's answer
  QuizSubmission,     // Submission record
  ActiveQuizSession,  // Active session data
} from '@/stores';
```

## 🛠️ Utility Exports

```typescript
import {
  resetAllStores,    // Clear all persisted data
  getStoreVersion,   // Get store version number
} from '@/stores';
```

---

## Complete Import Example

```typescript
// Import everything you need in one line
import {
  // Stores
  useAuthStore,
  useAcademyStore,
  useSkillTreeStore,
  useQuizStore,
  
  // Types
  type AuthUser,
  type AcademyView,
  type SkillDefinition,
  type Quiz,
  
  // Utils
  resetAllStores,
} from '@/stores';
```

---

## Store State Reference

### useAuthStore
```typescript
interface AuthState {
  // State
  isAuthenticated: boolean;
  user: AuthUser | null;
  enrollmentDate: string | null;
  
  // Actions
  login: (user: AuthUser) => void;
  logout: () => void;
}
```

### useAcademyStore
```typescript
interface AcademyState {
  // State
  currentView: AcademyView;
  selectedModuleId: string | null;
  selectedSectionId: string | null;
  modulesStarted: ModuleProgress[];
  modulesCompleted: string[];
  sectionsViewed: SectionView[];
  timeSpentPerModule: Record<string, number>;
  lastActiveDate: string | null;
  
  // Actions
  setView: (view: AcademyView) => void;
  selectModule: (moduleId: string | null) => void;
  selectSection: (sectionId: string | null, moduleId?: string) => void;
  markModuleStarted: (moduleId: string) => void;
  markModuleComplete: (moduleId: string) => void;
  trackTime: (moduleId: string, seconds: number) => void;
  trackSectionView: (sectionId: string, moduleId: string, timeSpent: number) => void;
  updateLastActive: () => void;
  
  // Helpers
  isModuleStarted: (moduleId: string) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  isSectionViewed: (sectionId: string) => boolean;
  getModuleProgress: (moduleId: string) => ModuleProgress | null;
  getTotalTimeSpent: () => number;
}
```

### useSkillTreeStore
```typescript
interface SkillTreeState {
  // State
  unlockedSkills: string[];
  skillProgress: SkillProgress[];
  currentXP: number;
  
  // Actions
  unlockSkill: (skillId: string) => void;
  updateProgress: (skillId: string, progress: number) => void;
  setCurrentXP: (xp: number) => void;
  canUnlock: (skillId: string, skillDef: SkillDefinition) => {
    canUnlock: boolean;
    reason?: string;
  };
  
  // Helpers
  isSkillUnlocked: (skillId: string) => boolean;
  getSkillProgress: (skillId: string) => SkillProgress | null;
  getUnlockedSkillsCount: () => number;
  getTotalProgress: () => number;
}
```

### useQuizStore
```typescript
interface QuizState {
  // State
  activeQuiz: ActiveQuizSession | null;
  submissions: QuizSubmission[];
  
  // Actions
  startQuiz: (quizId: string, moduleId: string) => void;
  answerQuestion: (questionId: string, selectedAnswer: number, isCorrect: boolean) => void;
  submitQuiz: (quiz: Quiz) => QuizSubmission;
  clearActiveQuiz: () => void;
  
  // Helpers
  getQuizScore: (quizId: string) => QuizSubmission | null;
  hasPassedQuiz: (quizId: string) => boolean;
  getBestScore: (quizId: string) => number;
  getAttemptCount: (quizId: string) => number;
  getAllSubmissions: (moduleId?: string) => QuizSubmission[];
  getAverageScore: () => number;
}
```

---

## localStorage Keys

All stores persist to localStorage with these keys:

```typescript
const STORAGE_KEYS = {
  AUTH: 'vibe-auth-storage',
  ACADEMY: 'vibe-academy-storage',
  SKILLS: 'vibe-skills-storage',
  QUIZ: 'vibe-quiz-storage',
} as const;
```

---

## Quick Copy-Paste Imports

### Minimal Import
```typescript
import { useAuthStore } from '@/stores';
```

### With Types
```typescript
import { useAuthStore, type AuthUser } from '@/stores';
```

### Multiple Stores
```typescript
import {
  useAuthStore,
  useAcademyStore,
  useSkillTreeStore,
  useQuizStore,
} from '@/stores';
```

### With All Types
```typescript
import {
  useAuthStore,
  useAcademyStore,
  useSkillTreeStore,
  useQuizStore,
  type AuthUser,
  type AcademyView,
  type SkillDefinition,
  type Quiz,
} from '@/stores';
```

### With Utils
```typescript
import {
  useAuthStore,
  resetAllStores,
  getStoreVersion,
} from '@/stores';
```

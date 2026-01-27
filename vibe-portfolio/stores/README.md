# Vibe Portfolio - State Management

Production-ready Zustand stores with TypeScript strict types and localStorage persistence.

## 📦 Stores Overview

### 1. **useAuthStore** - Authentication Management
**File:** `useAuthStore.ts`  
**Storage Key:** `vibe-auth-storage`

Manages user authentication state and enrollment tracking.

```typescript
import { useAuthStore } from '@/stores';

// Usage example
function LoginComponent() {
  const { isAuthenticated, user, login, logout } = useAuthStore();

  const handleLogin = () => {
    login({
      email: 'user@example.com',
      name: 'John Doe',
      authMethod: 'email'
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

**State:**
- `isAuthenticated: boolean` - Authentication status
- `user: AuthUser | null` - Current user data
- `enrollmentDate: string | null` - First login timestamp (persists through logout)

**Actions:**
- `login(user: AuthUser)` - Authenticate user and set enrollment date
- `logout()` - Clear auth state (preserves enrollment date)

---

### 2. **useAcademyStore** - Learning Progress
**File:** `useAcademyStore.ts`  
**Storage Key:** `vibe-academy-storage`

Tracks learning navigation, module progress, and time spent.

```typescript
import { useAcademyStore } from '@/stores';

// Usage example
function ModuleCard({ moduleId }: { moduleId: string }) {
  const {
    selectModule,
    isModuleStarted,
    isModuleCompleted,
    markModuleComplete,
    trackTime
  } = useAcademyStore();

  const started = isModuleStarted(moduleId);
  const completed = isModuleCompleted(moduleId);

  const handleStart = () => {
    selectModule(moduleId);
  };

  const handleComplete = () => {
    trackTime(moduleId, 1800); // 30 minutes
    markModuleComplete(moduleId);
  };

  return (
    <div>
      <h3>Module Status</h3>
      <p>{completed ? '✅ Completed' : started ? '🔄 In Progress' : '🔒 Not Started'}</p>
      {!started && <button onClick={handleStart}>Start Module</button>}
      {started && !completed && <button onClick={handleComplete}>Mark Complete</button>}
    </div>
  );
}
```

**State:**
- `currentView: AcademyView` - Current navigation view
- `selectedModuleId: string | null` - Active module
- `selectedSectionId: string | null` - Active section
- `modulesStarted: ModuleProgress[]` - Started modules with timestamps
- `modulesCompleted: string[]` - Completed module IDs
- `sectionsViewed: SectionView[]` - Section view history
- `timeSpentPerModule: Record<string, number>` - Time tracking (seconds)
- `lastActiveDate: string | null` - Last activity timestamp

**Actions:**
- `setView(view: AcademyView)` - Change navigation view
- `selectModule(moduleId: string | null)` - Select/deselect module (auto-starts)
- `selectSection(sectionId: string | null, moduleId?: string)` - Select section
- `markModuleStarted(moduleId: string)` - Manually mark module as started
- `markModuleComplete(moduleId: string)` - Mark module completed
- `trackTime(moduleId: string, seconds: number)` - Add time spent
- `trackSectionView(sectionId: string, moduleId: string, timeSpent: number)` - Track section viewing
- `updateLastActive()` - Update last activity timestamp

**Helpers:**
- `isModuleStarted(moduleId: string): boolean`
- `isModuleCompleted(moduleId: string): boolean`
- `isSectionViewed(sectionId: string): boolean`
- `getModuleProgress(moduleId: string): ModuleProgress | null`
- `getTotalTimeSpent(): number`

---

### 3. **useSkillTreeStore** - Skill Progression
**File:** `useSkillTreeStore.ts`  
**Storage Key:** `vibe-skills-storage`

Manages skill unlocking with XP system and prerequisite validation.

```typescript
import { useSkillTreeStore } from '@/stores';

// Usage example
const skillDefinition = {
  id: 'react-hooks',
  name: 'React Hooks Mastery',
  description: 'Master useState, useEffect, and custom hooks',
  xpRequired: 500,
  prerequisites: [
    { skillId: 'react-basics', requiredProgress: 100 }
  ],
  tier: 2
};

function SkillTreeNode({ skill }: { skill: typeof skillDefinition }) {
  const {
    isSkillUnlocked,
    getSkillProgress,
    canUnlock,
    unlockSkill,
    updateProgress,
    currentXP
  } = useSkillTreeStore();

  const unlocked = isSkillUnlocked(skill.id);
  const progress = getSkillProgress(skill.id);
  const { canUnlock: canUnlockSkill, reason } = canUnlock(skill.id, skill);

  const handleUnlock = () => {
    if (canUnlockSkill) {
      unlockSkill(skill.id);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    updateProgress(skill.id, newProgress);
  };

  return (
    <div>
      <h3>{skill.name}</h3>
      <p>XP Required: {skill.xpRequired} (Current: {currentXP})</p>
      
      {!unlocked && (
        <button onClick={handleUnlock} disabled={!canUnlockSkill}>
          {canUnlockSkill ? 'Unlock Skill' : `Locked: ${reason}`}
        </button>
      )}
      
      {unlocked && progress && (
        <div>
          <p>Progress: {progress.progress}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={progress.progress}
            onChange={(e) => handleProgressUpdate(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
```

**State:**
- `unlockedSkills: string[]` - List of unlocked skill IDs
- `skillProgress: SkillProgress[]` - Progress tracking for each skill
- `currentXP: number` - Current XP points (synced from external system)

**Actions:**
- `unlockSkill(skillId: string)` - Unlock a skill (no validation)
- `updateProgress(skillId: string, progress: number)` - Update skill progress (0-100)
- `setCurrentXP(xp: number)` - Sync XP from external system
- `canUnlock(skillId: string, skillDef: SkillDefinition)` - Validate prerequisites

**Helpers:**
- `isSkillUnlocked(skillId: string): boolean`
- `getSkillProgress(skillId: string): SkillProgress | null`
- `getUnlockedSkillsCount(): number`
- `getTotalProgress(): number` - Average progress across all skills

---

### 4. **useQuizStore** - Quiz Management
**File:** `useQuizStore.ts`  
**Storage Key:** `vibe-quiz-storage`

Manages quiz sessions, answers, and submission history.

```typescript
import { useQuizStore } from '@/stores';

// Usage example
const quiz = {
  id: 'react-basics-quiz',
  moduleId: 'react-module',
  title: 'React Basics Quiz',
  description: 'Test your React knowledge',
  passingScore: 70,
  timeLimit: 600, // 10 minutes
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice' as const,
      question: 'What is JSX?',
      options: [
        'JavaScript XML',
        'Java Syntax Extension',
        'JSON Extended',
        'JavaScript Extra'
      ],
      correctAnswer: 0,
      explanation: 'JSX stands for JavaScript XML',
      points: 10
    }
  ]
};

function QuizComponent() {
  const {
    activeQuiz,
    startQuiz,
    answerQuestion,
    submitQuiz,
    hasPassedQuiz,
    getBestScore,
    getAttemptCount
  } = useQuizStore();

  const passed = hasPassedQuiz(quiz.id);
  const bestScore = getBestScore(quiz.id);
  const attempts = getAttemptCount(quiz.id);

  const handleStart = () => {
    startQuiz(quiz.id, quiz.moduleId);
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    const question = quiz.questions.find(q => q.id === questionId);
    const isCorrect = question?.correctAnswer === answerIndex;
    answerQuestion(questionId, answerIndex, isCorrect);
  };

  const handleSubmit = () => {
    const submission = submitQuiz(quiz);
    console.log(`Score: ${submission.score}%`);
    console.log(`Passed: ${submission.passed}`);
  };

  return (
    <div>
      <h2>{quiz.title}</h2>
      
      {!activeQuiz && (
        <div>
          <p>Attempts: {attempts}</p>
          <p>Best Score: {bestScore}%</p>
          <p>{passed ? '✅ Passed' : '❌ Not passed yet'}</p>
          <button onClick={handleStart}>
            {attempts > 0 ? 'Retry Quiz' : 'Start Quiz'}
          </button>
        </div>
      )}

      {activeQuiz && (
        <div>
          {quiz.questions.map((q) => (
            <div key={q.id}>
              <h3>{q.question}</h3>
              {q.options.map((option, idx) => (
                <button key={idx} onClick={() => handleAnswer(q.id, idx)}>
                  {option}
                </button>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Quiz</button>
        </div>
      )}
    </div>
  );
}
```

**State:**
- `activeQuiz: ActiveQuizSession | null` - Current quiz session
- `submissions: QuizSubmission[]` - Complete submission history

**Actions:**
- `startQuiz(quizId: string, moduleId: string)` - Begin quiz session
- `answerQuestion(questionId: string, selectedAnswer: number, isCorrect: boolean)` - Record answer
- `submitQuiz(quiz: Quiz): QuizSubmission` - Submit and score quiz
- `clearActiveQuiz()` - Cancel current session

**Helpers:**
- `getQuizScore(quizId: string): QuizSubmission | null` - Get most recent submission
- `hasPassedQuiz(quizId: string): boolean` - Check if ever passed
- `getBestScore(quizId: string): number` - Highest score achieved
- `getAttemptCount(quizId: string): number` - Number of attempts
- `getAllSubmissions(moduleId?: string): QuizSubmission[]` - Get all/filtered submissions
- `getAverageScore(): number` - Average score across all quizzes

---

## 🔄 Persistence

All stores use Zustand's `persist` middleware with localStorage:

```typescript
{
  name: 'vibe-[store]-storage',  // localStorage key
  version: 1,                      // Migration support
  partialize: (state) => ({        // Only persist specific fields
    // ... selected state
  })
}
```

### Storage Keys
- `vibe-auth-storage` - Authentication state
- `vibe-academy-storage` - Learning progress
- `vibe-skills-storage` - Skill tree data
- `vibe-quiz-storage` - Quiz history

---

## 🧹 Utilities

### Reset All Stores
```typescript
import { resetAllStores } from '@/stores';

// Clear all persisted data and reload
resetAllStores();
```

### Check Store Version
```typescript
import { getStoreVersion } from '@/stores';

const version = getStoreVersion('vibe-auth-storage');
console.log(`Auth store version: ${version}`);
```

---

## 🎯 Best Practices

### 1. **Selective State Access**
Only subscribe to the state you need:

```typescript
// ❌ Bad - re-renders on any auth change
const authStore = useAuthStore();

// ✅ Good - only re-renders when user changes
const user = useAuthStore(state => state.user);
const login = useAuthStore(state => state.login);
```

### 2. **Computed Values**
Use built-in helper methods for computed values:

```typescript
// ❌ Bad - computing in component
const totalTime = Object.values(timeSpentPerModule).reduce((sum, t) => sum + t, 0);

// ✅ Good - use helper
const totalTime = useAcademyStore(state => state.getTotalTimeSpent());
```

### 3. **Action Batching**
Actions are automatically batched by Zustand:

```typescript
// These updates are batched into a single re-render
const handleCompleteModule = (moduleId: string) => {
  markModuleComplete(moduleId);
  trackTime(moduleId, 300);
  updateLastActive();
};
```

### 4. **Type Safety**
Always import and use TypeScript types:

```typescript
import { useAuthStore, type AuthUser, type AuthMethod } from '@/stores';

const user: AuthUser = {
  email: 'user@example.com',
  name: 'John Doe',
  authMethod: 'email'
};
```

---

## 🔗 Integration Examples

### XP System Integration
```typescript
// Sync XP from external system to skill tree
import { useSkillTreeStore } from '@/stores';
import { useEffect } from 'react';

function XPSyncComponent() {
  const setCurrentXP = useSkillTreeStore(state => state.setCurrentXP);
  const { xp } = useExternalXPSystem(); // Your XP tracking system

  useEffect(() => {
    setCurrentXP(xp);
  }, [xp, setCurrentXP]);

  return null;
}
```

### Quiz Score to XP Conversion
```typescript
import { useQuizStore, useSkillTreeStore } from '@/stores';

function QuizCompletionHandler() {
  const submitQuiz = useQuizStore(state => state.submitQuiz);
  const setCurrentXP = useSkillTreeStore(state => state.setCurrentXP);
  const currentXP = useSkillTreeStore(state => state.currentXP);

  const handleQuizComplete = (quiz: Quiz) => {
    const submission = submitQuiz(quiz);
    
    // Award XP based on score
    const xpEarned = Math.floor(submission.score * 10); // 100% = 1000 XP
    setCurrentXP(currentXP + xpEarned);
    
    return submission;
  };

  return { handleQuizComplete };
}
```

---

## 📊 State Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     VIBE PORTFOLIO STATE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ useAuthStore │    │useAcademyStore│    │useSkillTree  │  │
│  │              │    │              │    │    Store     │  │
│  │ - Auth       │───▶│ - Progress   │───▶│ - Skills     │  │
│  │ - Enrollment │    │ - Time Track │    │ - XP         │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │         │
│         └────────────────────┼────────────────────┘         │
│                              │                              │
│                     ┌──────────────┐                        │
│                     │ useQuizStore │                        │
│                     │              │                        │
│                     │ - Quizzes    │                        │
│                     │ - Scores     │                        │
│                     └──────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

Example test setup:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear store before each test
    localStorage.removeItem('vibe-auth-storage');
  });

  it('should login user and set enrollment date', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({
        email: 'test@example.com',
        name: 'Test User',
        authMethod: 'email'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Test User');
    expect(result.current.enrollmentDate).toBeDefined();
  });

  it('should preserve enrollment date after logout', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({
        email: 'test@example.com',
        name: 'Test User',
        authMethod: 'email'
      });
    });

    const enrollmentDate = result.current.enrollmentDate;

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.enrollmentDate).toBe(enrollmentDate);
  });
});
```

---

## 📝 Migration Guide

Future version migrations will be handled automatically. If you need to manually migrate:

```typescript
// stores/migrations.ts
export const migrateAuthStore = (persistedState: any, version: number) => {
  if (version === 0) {
    // Migrate from v0 to v1
    return {
      ...persistedState,
      enrollmentDate: persistedState.createdAt || null
    };
  }
  return persistedState;
};
```

---

## 🎓 License

Part of the Vibe Portfolio project.

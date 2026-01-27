# Zustand State Architecture

## 🏗️ Store Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        VIBE PORTFOLIO APPLICATION                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
        │  Components   │ │    Pages     │ │    Hooks     │
        │               │ │              │ │              │
        │  - Terminal   │ │ - Academy    │ │ - useTimer   │
        │  - SkillTree  │ │ - Portfolio  │ │ - useAuth    │
        │  - Quiz       │ │ - Contact    │ │ - useLearn   │
        └───────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌───────────────────────────────────────────────┐
        │            ZUSTAND STORES (State Layer)       │
        ├───────────────────────────────────────────────┤
        │                                               │
        │  ┌─────────────┐      ┌─────────────┐       │
        │  │ Auth Store  │──────│Academy Store│       │
        │  │             │      │             │       │
        │  │ - user      │      │ - progress  │       │
        │  │ - enrolled  │      │ - time      │       │
        │  └─────────────┘      └─────────────┘       │
        │         │                     │              │
        │         │                     │              │
        │  ┌─────────────┐      ┌─────────────┐       │
        │  │ Skill Store │──────│ Quiz Store  │       │
        │  │             │      │             │       │
        │  │ - unlocked  │      │ - sessions  │       │
        │  │ - XP        │      │ - scores    │       │
        │  └─────────────┘      └─────────────┘       │
        │                                               │
        └───────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌───────────────────────────────────────────────┐
        │          PERSISTENCE LAYER (localStorage)     │
        ├───────────────────────────────────────────────┤
        │                                               │
        │  vibe-auth-storage      vibe-academy-storage │
        │  vibe-skills-storage    vibe-quiz-storage    │
        │                                               │
        └───────────────────────────────────────────────┘
```

## 📊 Store Relationships

### Data Flow Diagram

```
┌─────────────┐
│   Login     │
│   Action    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  useAuthStore       │
│  ─────────────      │
│  + login()          │────┐
│  + logout()         │    │
│  + isAuthenticated  │    │ Sets enrollment
│  + enrollmentDate   │    │
└─────────────────────┘    │
                           │
       ┌───────────────────┘
       │
       ▼
┌─────────────────────┐
│  useAcademyStore    │
│  ─────────────      │
│  + selectModule()   │────┐
│  + trackTime()      │    │
│  + markComplete()   │    │ Awards XP
│  + progress         │    │
└─────────────────────┘    │
                           │
       ┌───────────────────┘
       │
       ▼
┌─────────────────────┐
│  useQuizStore       │
│  ─────────────      │
│  + startQuiz()      │────┐
│  + submitQuiz()     │    │
│  + getScore()       │    │ Earns XP
│  + submissions      │    │
└─────────────────────┘    │
                           │
       ┌───────────────────┘
       │
       ▼
┌─────────────────────┐
│  useSkillTreeStore  │
│  ─────────────      │
│  + setCurrentXP()   │
│  + unlockSkill()    │
│  + canUnlock()      │
│  + skillProgress    │
└─────────────────────┘
```

## 🔄 State Update Flow

### 1. User Authenticates

```
User clicks "Login"
    ↓
useAuthStore.login(userData)
    ↓
State updates:
  - isAuthenticated = true
  - user = userInfo
  - enrollmentDate = ISO timestamp
    ↓
Persists to localStorage
    ↓
Components re-render
```

### 2. User Starts Learning

```
User selects module
    ↓
useAcademyStore.selectModule(moduleId)
    ↓
State updates:
  - currentView = 'module'
  - selectedModuleId = moduleId
  - modulesStarted += new progress
  - lastActiveDate = now
    ↓
useAcademyStore.trackTime(moduleId, seconds)
    ↓
State updates:
  - timeSpentPerModule[moduleId] += seconds
    ↓
Persists to localStorage
```

### 3. User Completes Quiz

```
User submits quiz
    ↓
useQuizStore.submitQuiz(quiz)
    ↓
Calculate score & pass/fail
    ↓
State updates:
  - submissions += new submission
  - activeQuiz = null
    ↓
Award XP based on score
    ↓
useSkillTreeStore.setCurrentXP(newXP)
    ↓
State updates:
  - currentXP = newXP
    ↓
Check skill unlocks
    ↓
useSkillTreeStore.canUnlock(skillId, skillDef)
    ↓
If requirements met:
  useSkillTreeStore.unlockSkill(skillId)
    ↓
State updates:
  - unlockedSkills += skillId
  - skillProgress += new progress
    ↓
Persists to localStorage
```

## 🎯 Access Patterns

### Pattern 1: Subscribe to Entire Store
```typescript
const authStore = useAuthStore();
// ❌ Component re-renders on ANY auth state change
```

### Pattern 2: Subscribe to Specific State (RECOMMENDED)
```typescript
const user = useAuthStore(state => state.user);
const login = useAuthStore(state => state.login);
// ✅ Only re-renders when user changes
```

### Pattern 3: Subscribe to Computed Value
```typescript
const totalTime = useAcademyStore(state => state.getTotalTimeSpent());
// ✅ Re-renders when time tracking changes
```

### Pattern 4: Imperative Access (No Subscription)
```typescript
const handleAction = () => {
  const currentXP = useSkillTreeStore.getState().currentXP;
  // ✅ No re-renders, just reads current value
};
```

## 🔐 State Isolation

Each store is independent:

```
useAuthStore          useAcademyStore
    ↓                       ↓
vibe-auth-storage    vibe-academy-storage
    (localStorage)       (localStorage)

useSkillTreeStore     useQuizStore
    ↓                       ↓
vibe-skills-storage  vibe-quiz-storage
    (localStorage)       (localStorage)
```

**Benefits:**
- ✅ Independent persistence
- ✅ Granular cache control
- ✅ Easy to reset individual stores
- ✅ Version migration per store

## 🧩 Integration Points

### XP System Integration

```typescript
// Component that syncs quiz scores to XP
function QuizXPSync() {
  const submitQuiz = useQuizStore(state => state.submitQuiz);
  const setCurrentXP = useSkillTreeStore(state => state.setCurrentXP);
  const currentXP = useSkillTreeStore(state => state.currentXP);

  const handleQuizSubmit = (quiz: Quiz) => {
    const submission = submitQuiz(quiz);
    const xpEarned = calculateXP(submission.score);
    setCurrentXP(currentXP + xpEarned);
  };

  return { handleQuizSubmit };
}
```

### Progress Tracking Integration

```typescript
// Component that tracks time spent
function ModuleTimeTracker({ moduleId }: { moduleId: string }) {
  const trackTime = useAcademyStore(state => state.trackTime);
  
  useEffect(() => {
    const interval = setInterval(() => {
      trackTime(moduleId, 60); // Track every minute
    }, 60000);
    
    return () => clearInterval(interval);
  }, [moduleId, trackTime]);
  
  return null;
}
```

### Skill Unlock Integration

```typescript
// Component that unlocks skills when conditions met
function SkillUnlockManager() {
  const currentXP = useSkillTreeStore(state => state.currentXP);
  const canUnlock = useSkillTreeStore(state => state.canUnlock);
  const unlockSkill = useSkillTreeStore(state => state.unlockSkill);
  
  const checkAndUnlock = (skillDef: SkillDefinition) => {
    const { canUnlock: allowed, reason } = canUnlock(skillDef.id, skillDef);
    
    if (allowed) {
      unlockSkill(skillDef.id);
      toast.success(`Skill unlocked: ${skillDef.name}!`);
    }
  };
  
  return { checkAndUnlock };
}
```

## 📦 Bundle Size Impact

Zustand is lightweight:

```
zustand:         ~3KB gzipped
useAuthStore:    ~1KB
useAcademyStore: ~2KB
useSkillStore:   ~1.5KB
useQuizStore:    ~1.8KB
────────────────────────
Total:           ~9.3KB gzipped
```

## 🔍 Debugging

### View Store State in DevTools

```typescript
// Add to any component during development
useEffect(() => {
  console.log('Auth State:', useAuthStore.getState());
  console.log('Academy State:', useAcademyStore.getState());
  console.log('Skills State:', useSkillTreeStore.getState());
  console.log('Quiz State:', useQuizStore.getState());
}, []);
```

### Inspect localStorage

```javascript
// In browser console
Object.keys(localStorage)
  .filter(key => key.startsWith('vibe-'))
  .forEach(key => {
    console.log(key, JSON.parse(localStorage.getItem(key)));
  });
```

### Track State Changes

```typescript
// Add middleware for logging
import { devtools } from 'zustand/middleware';

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({ /* store */ }),
      { name: 'vibe-auth-storage' }
    ),
    { name: 'Auth Store' }
  )
);
```

## 🚀 Performance Optimizations

### 1. Selective Updates
Only update state that changed:

```typescript
// ❌ Bad - creates new object every time
set({ user, timestamp: Date.now() });

// ✅ Good - only updates if user changed
set((state) => 
  state.user?.id !== user.id 
    ? { user, timestamp: Date.now() }
    : state
);
```

### 2. Batch Updates
Zustand automatically batches updates:

```typescript
const completeModule = (moduleId: string) => {
  // These are batched into a single re-render
  markModuleComplete(moduleId);
  trackTime(moduleId, 300);
  updateLastActive();
};
```

### 3. Memoization
Use selectors with shallow equality:

```typescript
import { shallow } from 'zustand/shallow';

const { completedCount, startedCount } = useAcademyStore(
  state => ({
    completedCount: state.modulesCompleted.length,
    startedCount: state.modulesStarted.length
  }),
  shallow // Only re-render if values change
);
```

## 📐 Type System

### Type Inference Flow

```typescript
// Store definition
interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
}

// Type inference
const user = useAuthStore(state => state.user);
//    ^? AuthUser | null (automatically inferred)

const login = useAuthStore(state => state.login);
//    ^? (user: AuthUser) => void (automatically inferred)
```

### Generic Patterns

```typescript
// Generic helper type
type Selector<T, U> = (state: T) => U;

// Usage
const userSelector: Selector<AuthState, AuthUser | null> = 
  state => state.user;

const user = useAuthStore(userSelector);
```

## 🎓 Best Practices Summary

1. ✅ Subscribe to specific state slices
2. ✅ Use computed helpers for derived values
3. ✅ Keep actions pure and simple
4. ✅ Persist only necessary data
5. ✅ Version stores for migrations
6. ✅ Use TypeScript strict mode
7. ✅ Test stores in isolation
8. ✅ Document state structure
9. ✅ Keep stores focused (single responsibility)
10. ✅ Use shallow comparison for objects

---

**Architecture Status**: ✅ Production-Ready  
**Type Safety**: ✅ 100% TypeScript  
**Persistence**: ✅ localStorage with versioning  
**Performance**: ✅ Optimized with selective subscriptions

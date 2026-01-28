# Zustand Stores - Quick Start Guide

## 🚀 5-Minute Integration

### Step 1: Import the Store

```typescript
import { useAuthStore } from '@/stores';
```

### Step 2: Use in Component

```typescript
function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={() => login({
          email: 'user@example.com',
          name: 'User',
          authMethod: 'email'
        })}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Step 3: That's it! 🎉

The store automatically persists to localStorage.

---

## 📚 All Four Stores

### 1. Authentication (`useAuthStore`)

```typescript
import { useAuthStore } from '@/stores';

// Login user
useAuthStore.getState().login({
  email: 'user@example.com',
  name: 'John Doe',
  authMethod: 'email'
});

// Check if authenticated
const isLoggedIn = useAuthStore.getState().isAuthenticated;

// Get current user
const currentUser = useAuthStore.getState().user;

// Logout
useAuthStore.getState().logout();
```

### 2. Academy Progress (`useAcademyStore`)

```typescript
import { useAcademyStore } from '@/stores';

// Start a module
useAcademyStore.getState().selectModule('module-1');

// Track time spent
useAcademyStore.getState().trackTime('module-1', 300); // 5 minutes

// Mark module complete
useAcademyStore.getState().markModuleComplete('module-1');

// Check if module is completed
const isComplete = useAcademyStore.getState().isModuleCompleted('module-1');

// Get total time spent
const totalTime = useAcademyStore.getState().getTotalTimeSpent();
```

### 3. Skill Tree (`useSkillTreeStore`)

```typescript
import { useSkillTreeStore } from '@/stores';

// Set current XP
useSkillTreeStore.getState().setCurrentXP(1000);

// Unlock a skill
useSkillTreeStore.getState().unlockSkill('skill-1');

// Update skill progress
useSkillTreeStore.getState().updateProgress('skill-1', 50); // 50%

// Check if skill can be unlocked
const skillDef = {
  id: 'advanced-skill',
  name: 'Advanced Skill',
  description: 'Advanced feature',
  xpRequired: 500,
  prerequisites: [{ skillId: 'skill-1', requiredProgress: 100 }],
  tier: 2
};

const { canUnlock, reason } = useSkillTreeStore.getState().canUnlock(
  'advanced-skill',
  skillDef
);
```

### 4. Quiz System (`useQuizStore`)

```typescript
import { useQuizStore } from '@/stores';

// Start a quiz
useQuizStore.getState().startQuiz('quiz-1', 'module-1');

// Answer a question
useQuizStore.getState().answerQuestion('q1', 0, true); // Answer index 0, correct

// Submit quiz
const quiz = {
  id: 'quiz-1',
  moduleId: 'module-1',
  title: 'React Basics',
  description: 'Test your knowledge',
  passingScore: 70,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice' as const,
      question: 'What is React?',
      options: ['A library', 'A framework', 'A language', 'A tool'],
      correctAnswer: 0,
      points: 10
    }
  ]
};

const submission = useQuizStore.getState().submitQuiz(quiz);
console.log(`Score: ${submission.score}%, Passed: ${submission.passed}`);

// Check if quiz was passed
const hasPassed = useQuizStore.getState().hasPassedQuiz('quiz-1');

// Get best score
const bestScore = useQuizStore.getState().getBestScore('quiz-1');
```

---

## 🎯 Common Patterns

### Pattern 1: Subscribe to Specific State (Recommended)

```typescript
function Component() {
  // Only re-renders when user changes
  const user = useAuthStore(state => state.user);
  const login = useAuthStore(state => state.login);
  
  return <div>{user?.name}</div>;
}
```

### Pattern 2: Multiple State Values

```typescript
function Component() {
  const { user, isAuthenticated } = useAuthStore(
    state => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated
    })
  );
  
  return <div>{isAuthenticated && user?.name}</div>;
}
```

### Pattern 3: Imperative Access (No Re-renders)

```typescript
function handleAction() {
  // Just read the value, no subscription
  const currentXP = useSkillTreeStore.getState().currentXP;
  console.log('Current XP:', currentXP);
}
```

### Pattern 4: Outside React Components

```typescript
// In a utility function or API call
export async function syncUserProgress() {
  const progress = useAcademyStore.getState().modulesCompleted;
  await api.post('/sync', { progress });
}
```

---

## 🔗 Integration Examples

### Example 1: Login Flow

```typescript
function LoginPage() {
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async () => {
    // Your authentication logic here
    const user = await authenticateUser(email);
    
    // Update store
    login({
      email: user.email,
      name: user.name,
      authMethod: 'email'
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Example 2: Module Progress Tracker

```typescript
function ModuleCard({ moduleId, moduleTitle }: Props) {
  const {
    selectModule,
    isModuleStarted,
    isModuleCompleted,
    getModuleProgress
  } = useAcademyStore();

  const started = isModuleStarted(moduleId);
  const completed = isModuleCompleted(moduleId);
  const progress = getModuleProgress(moduleId);

  return (
    <div className="module-card">
      <h3>{moduleTitle}</h3>
      <div className="status">
        {completed && <span>✅ Completed</span>}
        {started && !completed && (
          <span>🔄 In Progress ({progress?.timeSpent}s)</span>
        )}
        {!started && <span>🔒 Not Started</span>}
      </div>
      <button onClick={() => selectModule(moduleId)}>
        {started ? 'Continue' : 'Start'}
      </button>
    </div>
  );
}
```

### Example 3: XP and Skill Unlocking

```typescript
function SkillUnlockSystem() {
  const { currentXP, unlockSkill, canUnlock } = useSkillTreeStore();
  const { submitQuiz } = useQuizStore();

  const handleQuizComplete = (quiz: Quiz) => {
    // Submit quiz and get score
    const submission = submitQuiz(quiz);
    
    // Award XP based on score
    const xpEarned = Math.floor(submission.score * 10);
    const newXP = currentXP + xpEarned;
    
    useSkillTreeStore.getState().setCurrentXP(newXP);
    
    // Check if new skills can be unlocked
    const skillToCheck = {
      id: 'skill-1',
      name: 'React Hooks',
      description: 'Master React Hooks',
      xpRequired: 500,
      prerequisites: [],
      tier: 1
    };
    
    const { canUnlock: allowed } = canUnlock('skill-1', skillToCheck);
    
    if (allowed) {
      unlockSkill('skill-1');
      toast.success('New skill unlocked!');
    }
  };

  return { handleQuizComplete };
}
```

### Example 4: Time Tracking Hook

```typescript
function useModuleTimer(moduleId: string | null) {
  const trackTime = useAcademyStore(state => state.trackTime);

  useEffect(() => {
    if (!moduleId) return;

    // Track time every 30 seconds
    const interval = setInterval(() => {
      trackTime(moduleId, 30);
    }, 30000);

    return () => clearInterval(interval);
  }, [moduleId, trackTime]);
}

// Usage in component
function ModulePage({ moduleId }: Props) {
  useModuleTimer(moduleId); // Automatically tracks time
  
  return <div>Module content...</div>;
}
```

---

## 🧹 Utility Functions

### Clear All Data

```typescript
import { resetAllStores } from '@/stores';

function SettingsPage() {
  const handleReset = () => {
    if (confirm('Clear all progress? This cannot be undone.')) {
      resetAllStores();
    }
  };

  return <button onClick={handleReset}>Reset All Data</button>;
}
```

### Export User Data

```typescript
function exportUserData() {
  const auth = useAuthStore.getState();
  const academy = useAcademyStore.getState();
  const skills = useSkillTreeStore.getState();
  const quizzes = useQuizStore.getState();

  const data = {
    user: auth.user,
    enrollmentDate: auth.enrollmentDate,
    modulesCompleted: academy.modulesCompleted,
    totalTimeSpent: academy.getTotalTimeSpent(),
    unlockedSkills: skills.unlockedSkills,
    currentXP: skills.currentXP,
    quizSubmissions: quizzes.submissions
  };

  // Download as JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vibe-portfolio-data.json';
  a.click();
}
```

---

## ⚡ Performance Tips

### 1. Use Selectors

```typescript
// ❌ Bad - re-renders on ANY auth change
const { user, isAuthenticated, enrollmentDate } = useAuthStore();

// ✅ Good - only re-renders when user changes
const user = useAuthStore(state => state.user);
```

### 2. Memoize Selectors

```typescript
import { useMemo } from 'react';

function Component() {
  const selector = useMemo(
    () => (state: AcademyState) => ({
      completed: state.modulesCompleted,
      total: state.modulesStarted.length
    }),
    []
  );

  const { completed, total } = useAcademyStore(selector);
}
```

### 3. Batch Updates

```typescript
// These are automatically batched by Zustand
const completeModule = (moduleId: string) => {
  const { markModuleComplete, trackTime, updateLastActive } = 
    useAcademyStore.getState();
  
  markModuleComplete(moduleId);
  trackTime(moduleId, 300);
  updateLastActive();
  // Only triggers ONE re-render
};
```

---

## 🐛 Debugging

### Log Store State

```typescript
// In browser console
console.log('Auth:', useAuthStore.getState());
console.log('Academy:', useAcademyStore.getState());
console.log('Skills:', useSkillTreeStore.getState());
console.log('Quizzes:', useQuizStore.getState());
```

### View localStorage

```typescript
// See persisted data
Object.keys(localStorage)
  .filter(key => key.startsWith('vibe-'))
  .forEach(key => {
    console.log(key, JSON.parse(localStorage.getItem(key) || '{}'));
  });
```

### Clear Specific Store

```typescript
// Clear just auth store
localStorage.removeItem('vibe-auth-storage');
window.location.reload();
```

---

## 📖 Full Documentation

- **README.md** - Complete usage guide with examples
- **ARCHITECTURE.md** - System design and data flow
- **IMPLEMENTATION_SUMMARY.md** - Technical details

---

## ✅ Checklist for Production

- [x] Install zustand: `npm install zustand`
- [x] Import stores from `@/stores`
- [x] Use TypeScript types from stores
- [x] Subscribe to specific state slices
- [x] Test in development mode
- [x] Verify localStorage persistence
- [x] Add error boundaries
- [x] Test store reset functionality

---

**You're ready to go!** 🚀

Start with `useAuthStore` for authentication, then integrate the others as needed.

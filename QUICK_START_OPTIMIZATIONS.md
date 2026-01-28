# Quick Start: Critical Optimizations Guide

## 🚨 START HERE: Day 1 Implementation

### 1. Code Splitting Setup (30 minutes)

```typescript
// vite.config.ts - UPDATE THIS FILE
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'markdown': ['react-markdown', 'remark-gfm'],
          'icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```

**Install bundle analyzer:**
```bash
npm install --save-dev rollup-plugin-visualizer
```

### 2. Lazy Load Routes (1 hour)

```typescript
// App.tsx - REPLACE EXISTING IMPORTS
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PasswordGate } from './components/PasswordGate';
import { ScrollToTop } from './components/ScrollToTop';
import { StickyCTA } from './components/StickyCTA';
import { EasterEggHints } from './components/EasterEggHints';
import { ErrorBoundary } from './components/ErrorBoundary';

// LAZY LOAD ALL PAGES
const HomePage = lazy(() => import('./pages/HomePage'));
const VibePage = lazy(() => import('./pages/VibePage'));
const ApproachPage = lazy(() => import('./pages/ApproachPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// CREATE LOADING COMPONENT
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white/60 text-sm">Loading...</p>
    </div>
  </div>
);

const App = (): React.ReactElement => {
  return (
    <PasswordGate>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/vibe" element={<VibePage />} />
              <Route path="/approach" element={<ApproachPage />} />
              <Route path="/academy" element={<AcademyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Suspense>
        <StickyCTA />
        <ErrorBoundary fallback={null}>
          <EasterEggHints />
        </ErrorBoundary>
      </BrowserRouter>
    </PasswordGate>
  );
};

export default App;
```

### 3. Tree-Shake Framer Motion (30 minutes)

```typescript
// index.tsx - WRAP APP WITH LAZYMOTION
import React from 'react';
import ReactDOM from 'react-dom/client';
import { LazyMotion, domAnimation } from 'framer-motion';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>
);
```

**Then in ALL components, replace:**
```typescript
// BEFORE
import { motion, AnimatePresence } from 'framer-motion';

// AFTER
import { m, AnimatePresence } from 'framer-motion';

// USAGE
<m.div>  {/* instead of <motion.div> */}
```

**Files to update (40 files):**
```bash
# Use find and replace in your editor
# Replace: <motion\. with: <m.
# Replace: </motion\. with: </m.
# Replace: import { motion, from: import { m,
```

### 4. Build and Verify (15 minutes)

```bash
# Build the app
npm run build

# Check the bundle sizes
ls -lh dist/assets/

# Open the bundle analyzer
# Should auto-open at dist/stats.html
```

**Expected Results:**
- Main bundle: ~800-900 KB (down from 1,700 KB)
- React vendor chunk: ~200 KB
- Framer Motion chunk: ~150 KB
- Other chunks: ~100-200 KB each

---

## 🎯 Day 2: Add React.memo (2-3 hours)

### Priority Components to Memoize

```typescript
// components/AcademyPage/BentoCard.tsx
import React from 'react';

export const BentoCard = React.memo(({ 
  title, 
  description, 
  emoji, 
  className 
}: BentoCardProps) => {
  // ... existing code
});

BentoCard.displayName = 'BentoCard';
```

**Components to memoize (do all 15):**
1. `components/AcademyPage/BentoCard.tsx`
2. `components/AcademyPage/ToolShowcase.tsx`
3. `components/artifacts/ToolArsenal/ToolCard.tsx`
4. `components/artifacts/CurriculumLog/ModulePreviewCard.tsx`
5. `components/artifacts/CurriculumLog/ModuleExpanded.tsx`
6. `components/artifacts/CurriculumLog/TimeEstimator.tsx`
7. `components/VibePage/MindsetCard.tsx`
8. `components/VibePage/ManifestoLine.tsx`
9. `components/ApproachPage/DiffView.tsx`
10. `components/ContactPage/FAQAccordion.tsx`
11. `components/ui/Terminal/TerminalLine.tsx`
12. `components/ui/Terminal/TerminalPrompt.tsx`
13. `components/BackgroundGrid.tsx`
14. `components/Philosophy.tsx`
15. `components/ToolsGrid.tsx`

**Pattern:**
```typescript
// Wrap the export with React.memo
export const ComponentName = React.memo(({ props }: Props) => {
  // ... component logic
});

// Add displayName for debugging
ComponentName.displayName = 'ComponentName';
```

---

## 📊 Day 3: Add Performance Monitoring (1 hour)

### Install web-vitals
```bash
npm install web-vitals
```

### Create monitoring hook
```typescript
// hooks/useWebVitals.ts
import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

export function useWebVitals() {
  useEffect(() => {
    const reportMetric = (metric: Metric) => {
      // Log to console in development
      if (import.meta.env.DEV) {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric);
      }
      
      // Send to analytics in production
      if (import.meta.env.PROD) {
        // TODO: Send to your analytics service
        // Example: analytics.track('web_vital', { ...metric });
      }
    };

    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }, []);
}
```

### Use in App.tsx
```typescript
// App.tsx
import { useWebVitals } from './hooks/useWebVitals';

const App = (): React.ReactElement => {
  useWebVitals();
  
  return (
    // ... rest of app
  );
};
```

---

## 🔍 Day 4: Intersection Observer for Animations (2 hours)

### Create useIntersectionObserver hook
```typescript
// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, isVisible, hasBeenVisible };
}
```

### Update MeshBackground.tsx
```typescript
// components/MeshBackground.tsx
import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export const MeshBackground: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  
  // Only animate when visible AND motion not reduced
  const shouldAnimate = isVisible && !prefersReducedMotion;
  
  const driftTransition = shouldAnimate
    ? { duration: 20, repeat: Infinity, ease: 'easeInOut' }
    : { duration: 0 };
  
  const glowTransition = shouldAnimate
    ? { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }
    : { duration: 0 };
  
  const pulseTransition = shouldAnimate
    ? { duration: 10, repeat: Infinity, ease: 'linear' }
    : { duration: 0 };

  return (
    <div 
      ref={ref}
      className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]" 
      aria-hidden="true"
    >
      {/* Only render animations if visible */}
      {isVisible && (
        <>
          <m.div
            animate={
              shouldAnimate
                ? { scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }
                : { scale: 1, x: 0, y: 0 }
            }
            transition={driftTransition}
            style={{ willChange: shouldAnimate ? 'transform' : 'auto' }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/20 blur-[90px]"
          />
          
          <m.div
            animate={
              shouldAnimate
                ? { scale: [1, 1.1, 1], x: [0, -60, 0], y: [0, 80, 0] }
                : { scale: 1, x: 0, y: 0 }
            }
            transition={glowTransition}
            style={{ willChange: shouldAnimate ? 'transform' : 'auto' }}
            className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[80px]"
          />

          <m.div
            animate={
              shouldAnimate
                ? { scale: [1, 1.15, 1], x: [0, -20, 0] }
                : { scale: 1, x: 0, y: 0 }
            }
            transition={pulseTransition}
            style={{ willChange: shouldAnimate ? 'transform' : 'auto', opacity: 0.4 }}
            className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/15 blur-[100px]"
          />
        </>
      )}
    </div>
  );
};
```

---

## ✅ Validation Checklist

After completing these steps, verify:

```bash
# 1. Bundle size reduced
npm run build
ls -lh dist/assets/
# Main bundle should be ~800-900 KB (down from 1,700 KB)

# 2. Lighthouse score improved
npx lighthouse http://localhost:3000 --view
# Target: Performance score > 80

# 3. Check for errors
npm run dev
# Open browser console, check for:
# - No lazy loading errors
# - No framer-motion errors
# - Web Vitals metrics logging

# 4. Test all routes
# Navigate to each page, ensure no loading issues
```

---

## 🚀 Expected Results After Day 4

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Bundle Size | 1,771 KB | ~900 KB | 49% reduction |
| Initial Load (4G) | ~4-5s | ~2-3s | 40-50% faster |
| TTI | ~4s | ~2.8s | 30% faster |
| Re-render count | High | 60% lower | React.memo |
| Animation CPU | 100% | 20-40% | Intersection Observer |

---

## 📋 Next Steps (Week 2)

1. Add Zustand for state management
2. Optimize images (WebP/AVIF)
3. Add service worker for caching
4. Implement prefetching for routes
5. Set up performance budgets in CI

---

## 🆘 Troubleshooting

### "motion is not defined" error
**Solution:** You forgot to change `motion` to `m` in a component.
```bash
# Find all instances
grep -r "motion\." components/ --include="*.tsx"
```

### Lazy loading routes cause white flash
**Solution:** Improve the loading component styling to match your theme.

### Bundle analyzer doesn't open
**Solution:** Manually open `dist/stats.html` in your browser.

### Web Vitals not logging
**Solution:** Check that you're in development mode and browser console is open.


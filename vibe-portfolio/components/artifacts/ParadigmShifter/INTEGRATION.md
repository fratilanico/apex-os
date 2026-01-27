# ParadigmShifter Integration Guide

## Quick Start

### 1. Import the Component

```tsx
import { ParadigmShifter } from '@/components/artifacts/ParadigmShifter';
```

### 2. Add to Your Page

```tsx
export const AcademyPage: React.FC = () => {
  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-7xl mx-auto pb-16">
      {/* Your existing hero content */}
      
      <section className="py-20">
        <ParadigmShifter />
      </section>
      
      {/* Rest of your page */}
    </main>
  );
};
```

## Full Example with Context

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ParadigmShifter } from '@/components/artifacts/ParadigmShifter';

export const AcademyPage: React.FC = () => {
  return (
    <main className="relative z-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-12 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold mb-4"
        >
          Vibe Coder Academy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/60"
        >
          Master the meta shift from autocomplete to orchestration
        </motion.p>
      </section>

      {/* Paradigm Shifter Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            The Mental Model Shift
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Understanding the difference between traditional AI-assisted coding 
            and true AI orchestration
          </motion.p>
        </div>

        <ParadigmShifter />
      </section>

      {/* More content below */}
    </main>
  );
};
```

## Styling Considerations

### Container Width
The component is designed to work within a `max-w-7xl` container. If you need a narrower layout:

```tsx
<div className="max-w-5xl mx-auto">
  <ParadigmShifter />
</div>
```

### Vertical Spacing
Add appropriate padding to your section:

```tsx
<section className="py-12 md:py-20">
  <ParadigmShifter />
</section>
```

### Background Contrast
For better visual separation, add a subtle background:

```tsx
<section className="py-20 bg-white/[0.01] border-y border-white/10">
  <ParadigmShifter />
</section>
```

## Advanced Usage

### With Section Header

```tsx
<section className="py-20">
  {/* Header */}
  <div className="max-w-3xl mx-auto mb-16 text-center">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
      <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest">
        CORE CONCEPT
      </span>
    </div>
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      Two Paradigms, One Future
    </h2>
    <p className="text-white/60 text-lg">
      See how Vibe Coders think differently about AI-assisted development
    </p>
  </div>

  {/* Component */}
  <ParadigmShifter />
</section>
```

### Within Bento Grid Layout

```tsx
<div className="grid grid-cols-1 gap-8">
  {/* Other cards */}
  
  <div className="col-span-1 lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-8">
    <ParadigmShifter />
  </div>
  
  {/* More cards */}
</div>
```

## Tracking User Interaction (Optional)

If you want to track which mode users prefer:

```tsx
import { ParadigmShifter } from '@/components/artifacts/ParadigmShifter';
import { useEffect } from 'react';

// Note: You'll need to modify ParadigmShifter.tsx to accept an onToggle callback
export const TrackedParadigmShifter = () => {
  const handleToggle = (mode: 'legacy' | 'vibe') => {
    // Track with your analytics
    console.log(`User toggled to: ${mode}`);
    // analytics.track('paradigm_toggle', { mode });
  };

  return <ParadigmShifter onToggle={handleToggle} />;
};
```

## Mobile Optimization

The component is already mobile-responsive, but you can enhance it:

```tsx
<section className="py-12 md:py-20 px-4">
  {/* On mobile, reduce vertical spacing */}
  <div className="space-y-8 md:space-y-0">
    <ParadigmShifter />
  </div>
</section>
```

## Performance Tips

1. **Code Splitting**: If this component is below the fold, consider lazy loading:

```tsx
import { lazy, Suspense } from 'react';

const ParadigmShifter = lazy(() => 
  import('@/components/artifacts/ParadigmShifter').then(m => ({ 
    default: m.ParadigmShifter 
  }))
);

function AcademyPage() {
  return (
    <section className="py-20">
      <Suspense fallback={<LoadingSkeleton />}>
        <ParadigmShifter />
      </Suspense>
    </section>
  );
}
```

2. **Intersection Observer**: Load animations only when visible:

```tsx
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function OptimizedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref}>
      {isInView && <ParadigmShifter />}
    </section>
  );
}
```

## Troubleshooting

### Terminal not displaying correctly
Ensure you have the Terminal UI components installed:
```tsx
import { TerminalWindow } from '@/components/ui/Terminal';
```

### Animations not smooth
Check that Framer Motion is installed:
```bash
npm install framer-motion
```

### TypeScript errors
Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler"
  }
}
```

## Next Steps

1. Place component in desired page location
2. Test on mobile devices
3. Monitor user engagement with toggle
4. Iterate on copy based on feedback

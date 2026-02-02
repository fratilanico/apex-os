# ParadigmShifter Component

## Overview
The **ParadigmShifter** is an interactive artifact that visualizes the mental model shift from traditional "Legacy Dev" autocomplete workflows to the "Vibe Coder" orchestration paradigm.

## Features

### 🎨 Visual Design
- **Toggle Pill**: Smooth animated toggle between Legacy Dev and Vibe Coder modes
- **Color Coding**: 
  - Legacy = Red accents (`red-400/500`)
  - Vibe = Cyan accents (`cyan-400/500`)
- **Glassmorphism**: Consistent with site aesthetic using backdrop blur and subtle borders
- **Responsive**: Mobile-first design, stacks vertically on `<768px`

### ⚡ Animations
- **Framer Motion** powered state transitions
- **AnimatePresence** for smooth content swapping
- **Staggered animations** for bullet points and content reveal
- **Spring physics** for toggle slider movement

### 📱 Responsive Behavior
- Desktop (`≥1024px`): Side-by-side layout (content left, terminal right)
- Tablet/Mobile (`<1024px`): Stacked layout (content above, terminal below)

## Component Structure

```
ParadigmShifter/
├── index.ts                    # Public exports
├── ParadigmShifter.tsx         # Main component with toggle state
├── LegacyState.tsx             # "Deprecated Mindset" view
├── VibeState.tsx               # "Current Meta" view
└── TerminalOutput.tsx          # Reusable terminal display
```

## Usage

```tsx
import { ParadigmShifter } from '@/components/artifacts/ParadigmShifter';

function AcademyPage() {
  return (
    <div>
      <ParadigmShifter />
    </div>
  );
}
```

## Content Breakdown

### Legacy State (Red)
**Badge**: `⊗ DEPRECATED MINDSET`

**Title**: "The Autocomplete Trap"

**Bullets** (with X icons):
- You type, AI suggests line-by-line.
- 80% of time spent reviewing syntax.
- Bottleneck: Your typing speed.

**Terminal Output**:
```
# Terminal Output
> git commit -m "fix syntax error"
> npm run build
Error: undefined is not a function
// debugging for 4 hours...
```

### Vibe State (Cyan)
**Badge**: `✓ CURRENT META`

**Title**: "The Orchestrator"

**Bullets** (with checkmark icons):
- You architect, Agents execute.
- Parallel execution streams.
- Bottleneck: Your imagination.

**Terminal Output**:
```
# System Logs
→ initializing_swarm_agents...
→ agent_1: generating_frontend [DONE]
→ agent_2: writing_tests [DONE]
SUCCESS: Deployment ready in 42s.
```

## Technical Details

### Dependencies
- React 19
- Framer Motion
- Tailwind CSS
- TypeScript (strict mode)

### Reused Components
- `TerminalWindow` from `@/components/ui/Terminal`

### Key Props

#### ParadigmShifter (Main)
No external props - fully self-contained with internal state.

#### TerminalOutput
```tsx
interface TerminalOutputProps {
  title: string;                    // Terminal window title
  lines: Array<{
    text: string;                   // Line content
    type?: 'default' | 'error' | 'success' | 'comment';
    delay?: number;                 // Animation delay
  }>;
  accentColor: 'red' | 'cyan';      // Color theme
}
```

## Animation Timings

| Element | Duration | Delay |
|---------|----------|-------|
| Toggle slider | Spring animation | - |
| State transition | 200ms fade | - |
| Container | Stagger (0.1s) | 0.1s initial |
| Individual items | 400ms | Staggered 0.1s |
| Terminal lines | 300ms | 0.1s per line |

## Accessibility

- ✅ Keyboard navigable toggle buttons
- ✅ ARIA-compliant button states
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Semantic HTML structure
- ✅ Motion-safe animations (respects `prefers-reduced-motion`)

## Customization

To modify content, edit:
- `LegacyState.tsx` → `legacyTerminalLines` array
- `VibeState.tsx` → `vibeTerminalLines` array
- Both files have hardcoded bullet text in `BulletPoint` components

To change colors:
- Tailwind theme already configured for `red-400/500` and `cyan-400/500`
- Update `accentColor` prop in `TerminalOutput` calls

## Performance

- Zero external API calls
- Minimal re-renders (state isolated to toggle)
- Lazy motion animations (GPU-accelerated)
- Build size: ~15KB gzipped (including Framer Motion)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+

## Future Enhancements

- [ ] Add sound effects on toggle
- [ ] Animated code snippets in terminal
- [ ] Shareable state via URL params
- [ ] Comparison metrics dashboard
- [ ] A/B test different copy variants

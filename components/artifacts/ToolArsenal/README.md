# ToolArsenal Component

A sophisticated bento grid component that displays the 12 AI tools from Vibe Coder Academy as a "C-Suite team."

## 📁 Component Structure

```
ToolArsenal/
├── index.ts              # Public exports
├── ToolArsenal.tsx       # Main container (bento grid)
├── ToolCard.tsx          # Individual card with hover effects
├── TierBadge.tsx         # CORE vs ASSET badge
└── README.md             # This file
```

## 🎨 Design Features

### Visual Design
- **Bento Grid Layout**: Responsive 3-column grid (desktop) → 1-column (mobile)
- **Glassmorphic Cards**: Semi-transparent with backdrop blur
- **Tier-Based Color Scheme**:
  - **CORE** tools: Cyan accent (`cyan-400/500`)
  - **ASSET** tools: Violet accent (`violet-400/500`)
- **Hover Effects**:
  - Subtle scale (1.02)
  - Border glow effect
  - Background gradient reveal
  - Description expansion (line-clamp)

### Role Mapping

Each of the 12 tools is personified as a C-Suite team member:

#### CORE TIER (6 tools - Daily Drivers)
1. **Cursor** → "The Builder" | Your Senior Engineer
2. **Claude Code** → "The Architect" | Your CTO
3. **Gemini 2.5** → "The Researcher" | Context Master
4. **OpenAI Codex** → "The Cloud Brain" | Async Orchestrator
5. **Antigravity** → "The Environment" | Your Dev Platform
6. **CodeMachine** → "The Scale Engine" | 10x Multiplier

#### ASSET TIER (6 tools - Specialized Tools)
7. **NotebookLM** → "The Analyst" | Knowledge Synthesizer
8. **Google Stitch** → "The Designer" | UI Generator
9. **GPT-5.2** → "The Debugger" | Error Hunter
10. **OpenCode** → "The Framework" | Agent Builder
11. **Imagen 3** → "The Artist" | Visual Engine
12. **Veo 3.1** → "The Cinematographer" | Video Generator

## 🚀 Usage

### Basic Import
```tsx
import { ToolArsenal } from '@/components/artifacts/ToolArsenal';

function MyPage() {
  return (
    <div>
      <ToolArsenal />
    </div>
  );
}
```

### Individual Components
```tsx
import { ToolCard, TierBadge } from '@/components/artifacts/ToolArsenal';

// Use individual components if needed
```

## 📊 Data Source

The component pulls data from:
- **File**: `/data/curriculumData.ts`
- **Export**: `tools` array (12 Tool objects)
- **Type**: `Tool` from `/types/curriculum.ts`

### Tool Data Structure
```typescript
interface Tool {
  id: string;           // 'cursor', 'claude-code', etc.
  name: string;         // 'Cursor'
  category: string;     // 'EDITOR', 'REASONING', etc.
  description: string;  // Short description
  tier: 'core' | 'asset';
  icon: string;         // Lucide icon name
  url?: string;         // Optional external link
}
```

## 🎯 Card Layout Anatomy

```
┌──────────────────────────────────┐
│ [Icon]              CORE/ASSET   │ ← Tier Badge (top-right)
│                                  │
│ The Architect                    │ ← Role (large, bold)
│ Your CTO                         │ ← Subtitle (muted)
│                                  │
│ CLAUDE CODE                      │ ← Tool Name (small caps)
│                                  │
│ The reasoning engine. Hand off   │ ← Description
│ complex refactoring and...       │   (expands on hover)
└──────────────────────────────────┘
```

## 🎬 Animations

Using **Framer Motion** for smooth interactions:

### Card Animation
- **Initial**: `opacity: 0, y: 20`
- **Animate**: `opacity: 1, y: 0`
- **Stagger**: 0.05s delay per card
- **Hover**: `scale: 1.02`

### Section Headers
- **CORE STACK**: Animates from left with 0.2s delay
- **ASSET LAYER**: Animates from left with 0.4s delay
- Both have pulsing indicator dot

## 🎨 Styling Details

### Color Tokens
```css
/* CORE tools */
bg-cyan-500/20       /* Badge background */
border-cyan-400/30   /* Badge border */
text-cyan-300        /* Badge text */
text-cyan-400        /* Accent elements */

/* ASSET tools */
bg-violet-500/20     /* Badge background */
border-violet-400/30 /* Badge border */
text-violet-300      /* Badge text */
text-violet-400      /* Accent elements */
```

### Responsive Grid
```css
grid-cols-1          /* Mobile: 1 column */
md:grid-cols-2       /* Tablet: 2 columns */
lg:grid-cols-3       /* Desktop: 3 columns */
gap-6                /* 1.5rem spacing */
```

## 🔧 Customization

### Modify Role Mapping
Edit `ROLE_MAPPING` constant in `ToolArsenal.tsx`:

```tsx
const ROLE_MAPPING: Record<string, { role: string; subtitle: string }> = {
  'cursor': {
    role: 'Your Custom Role',
    subtitle: 'Your Custom Subtitle',
  },
  // ...
};
```

### Adjust Grid Layout
Modify grid classes in `ToolArsenal.tsx`:

```tsx
// Example: 4 columns on large screens
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Change Colors
Update Tailwind classes in `TierBadge.tsx` and `ToolCard.tsx`

## 🎯 Future Enhancements

### Planned Features
- [ ] Click handler to open tool detail modal
- [ ] Filter by tier (CORE/ASSET toggle)
- [ ] Search/filter by tool name or category
- [ ] "Varied card heights" for visual interest (masonry layout)
- [ ] External link navigation for tools with `url` property
- [ ] Keyboard navigation support
- [ ] Animated stat blocks on hover

### Masonry Layout (Optional)
To implement varied card heights, replace CSS Grid with:
```tsx
// Option 1: react-masonry-css
import Masonry from 'react-masonry-css';

// Option 2: Tailwind grid-auto-rows
className="grid grid-cols-3 auto-rows-[200px]"
// Some cards span 2 rows
```

## 📦 Dependencies

- **Framer Motion**: Animation library (already in project)
- **Lucide React**: Icon library (already in project)
- **Tailwind CSS**: Utility-first CSS (already configured)
- **React 19**: Component framework

## 🐛 Troubleshooting

### Icons Not Rendering
- Ensure Lucide React is installed: `npm install lucide-react`
- Check icon names match Lucide's naming convention (PascalCase)

### Grid Not Responsive
- Verify Tailwind breakpoints in `tailwind.config.js`
- Check container max-width settings

### Animation Performance Issues
- Reduce stagger delay: `index * 0.03` instead of `0.05`
- Disable animations on mobile: `useReducedMotion()` hook

## 📝 Implementation Summary

### Files Created
1. **`ToolArsenal.tsx`** - Main container component (150 lines)
2. **`ToolCard.tsx`** - Individual card component (85 lines)
3. **`TierBadge.tsx`** - Tier badge component (25 lines)
4. **`index.ts`** - Public exports (3 lines)
5. **`README.md`** - This documentation

### Key Technical Decisions
- **Data-driven design**: All tool data sourced from `curriculumData.ts`
- **Role mapping**: Inline constant for easy customization
- **Separation of concerns**: Badge, Card, and Container are independent
- **Accessibility**: Semantic HTML, proper heading hierarchy
- **Performance**: Framer Motion animations are GPU-accelerated

### Build Status
✅ TypeScript compilation successful
✅ No runtime errors
✅ Production build passes (1.67MB bundle)

## 🎓 Usage in Vibe Coder Academy

This component is designed for the **Academy landing page** to showcase the tool stack.

Suggested placement:
1. After hero section
2. Before curriculum modules
3. As a standalone "Meet Your Team" page

---

**Built with** ⚡ by the Vibe Coder Academy team

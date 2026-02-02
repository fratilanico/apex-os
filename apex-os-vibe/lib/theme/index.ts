// APEX OS Design Tokens
// Golden Rule: Mobile-First, Performance-Optimized, Dark Theme
// Brand: Zinc-950 background, Cyan/Violet/Emerald accents

export const colors = {
  // Backgrounds
  background: '#0a0a0f',
  surface: 'rgba(255, 255, 255, 0.02)',
  surfaceHover: 'rgba(255, 255, 255, 0.05)',
  surfaceActive: 'rgba(255, 255, 255, 0.1)',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  borderFocus: 'rgba(34, 211, 238, 0.5)', // cyan-500/50
  
  // Text
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  textDisabled: 'rgba(255, 255, 255, 0.2)',
  
  // Accents - Brand Colors
  cyan: {
    400: '#22d3ee',
    500: '#06b6d4',
    glow: 'rgba(34, 211, 238, 0.3)',
  },
  violet: {
    400: '#a78bfa',
    500: '#8b5cf6',
    glow: 'rgba(167, 139, 250, 0.3)',
  },
  emerald: {
    400: '#10b981',
    500: '#059669',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  amber: {
    400: '#f59e0b',
    500: '#d97706',
  },
  rose: {
    400: '#f43f5e',
    500: '#e11d48',
  },
  
  // Gradients
  gradient: {
    primary: 'from-cyan-500 to-violet-500',
    accent: 'from-violet-600/20 to-cyan-600/20',
    cta: 'from-cyan-500/20 via-purple-500/20 to-emerald-500/20',
  },
} as const;

export const spacing = {
  // Page
  page: 'px-4 py-6 md:px-6 md:py-8 lg:px-8',
  pageMobile: 'px-4 py-6 pb-24',
  
  // Cards
  card: 'p-4 md:p-5',
  cardMobile: 'p-4',
  
  // Sections
  section: 'mb-6 md:mb-8',
  gap: 'gap-3 md:gap-4',
  
  // Touch targets
  touchMin: 'min-h-[44px] min-w-[44px]',
} as const;

export const borderRadius = {
  mobile: 'rounded-2xl',
  desktop: 'rounded-3xl',
  button: 'rounded-xl',
  pill: 'rounded-full',
} as const;

export const typography = {
  // Mobile
  mobile: {
    hero: 'text-4xl font-black tracking-tighter',
    title: 'text-xl font-bold',
    subtitle: 'text-lg font-semibold',
    body: 'text-sm font-medium',
    caption: 'text-xs font-medium',
    label: 'text-[10px] font-bold uppercase tracking-widest',
  },
  // Desktop
  desktop: {
    hero: 'text-7xl font-black tracking-tighter',
    title: 'text-3xl font-bold',
    subtitle: 'text-xl font-semibold',
    body: 'text-base font-medium',
    caption: 'text-sm font-medium',
    label: 'text-xs font-bold uppercase tracking-widest',
  },
} as const;

export const animations = {
  // Durations
  fast: { duration: 0.1 },
  normal: { duration: 0.3 },
  slow: { duration: 0.6 },
  
  // Easing
  easeOut: { ease: 'easeOut' },
  easeInOut: { ease: 'easeInOut' },
  
  // Spring
  spring: { type: 'spring', damping: 25, stiffness: 200 },
  springBouncy: { type: 'spring', damping: 20, stiffness: 300 },
  
  // Transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'spring', damping: 25, stiffness: 200 },
  },
  
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  
  scale: {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 },
  },
  
  stagger: {
    container: {
      animate: { transition: { staggerChildren: 0.1 } },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },
} as const;

export const shadows = {
  glow: {
    cyan: '0 0 20px rgba(34, 211, 238, 0.3)',
    violet: '0 0 20px rgba(167, 139, 250, 0.3)',
    emerald: '0 0 20px rgba(16, 185, 129, 0.3)',
    rose: '0 0 20px rgba(244, 63, 94, 0.3)',
    amber: '0 0 20px rgba(245, 158, 11, 0.3)',
  },
} as const;

// Utility function to get glass card styles
export const glassCard = (hover: boolean = false) => `
  bg-[${colors.surface}]
  backdrop-blur-xl
  border border-[${colors.border}]
  rounded-2xl
  ${hover ? 'hover:border-[${colors.borderHover}] hover:bg-[${colors.surfaceHover}]' : ''}
  transition-all duration-200
`;

// Utility function for status colors
export const statusColor = (status: 'online' | 'busy' | 'offline' | 'error') => {
  switch (status) {
    case 'online':
      return { bg: 'bg-emerald-400', text: 'text-emerald-400', glow: shadows.glow.emerald };
    case 'busy':
      return { bg: 'bg-amber-400', text: 'text-amber-400', glow: shadows.glow.amber };
    case 'error':
      return { bg: 'bg-rose-400', text: 'text-rose-400', glow: shadows.glow.rose };
    default:
      return { bg: 'bg-white/20', text: 'text-white/40', glow: 'none' };
  }
};

// Memory type colors
export const memoryTypeColor = (type: string) => {
  switch (type) {
    case 'file':
      return { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' };
    case 'agent_output':
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'conversation':
      return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'concept':
      return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'code':
      return { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' };
    default:
      return { bg: 'bg-white/10', text: 'text-white/60', border: 'border-white/20' };
  }
};

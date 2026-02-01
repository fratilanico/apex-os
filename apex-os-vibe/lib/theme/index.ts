// APEX OS Vibe - Design Tokens
// THE SOUL OF THE DESIGN - Extracted from vibe-portfolio
// Preserving the human-crafted aesthetic

export const soul = {
  // Background - Near black, NOT pure black (crucial distinction)
  background: '#030303',
  backgroundRgb: '3, 3, 3',
  
  // The Neural Gradient - Brand signature
  gradient: {
    primary: 'from-cyan-400 via-violet-400 to-emerald-400',
    hero: 'bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400',
    heroText: 'bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent',
    subtle: 'from-cyan-500/20 via-violet-500/20 to-emerald-500/20',
  },
  
  // Layered Opacity System - Creates depth without new colors
  surface: {
    1: 'rgba(255, 255, 255, 0.02)',   // Cards base
    2: 'rgba(255, 255, 255, 0.05)',   // Card hover
    3: 'rgba(255, 255, 255, 0.10)',   // Borders
    4: 'rgba(255, 255, 255, 0.20)',   // Active states
    5: 'rgba(255, 255, 255, 0.40)',   // Secondary text
    6: 'rgba(255, 255, 255, 0.60)',   // Primary text secondary
    7: 'rgba(255, 255, 255, 0.80)',   // Emphasis
    8: 'rgba(255, 255, 255, 0.90)',   // Bright
    9: 'rgba(255, 255, 255, 1.00)',   // Pure white
  },
  
  // Colors - The cyberpunk terminal palette
  colors: {
    cyan: {
      300: '#67e8f9',
      400: '#22d3ee',  // Primary
      500: '#06b6d4',
      glow: 'rgba(34, 211, 238, 0.3)',
    },
    violet: {
      300: '#c4b5fd',
      400: '#a78bfa',  // Secondary
      500: '#8b5cf6',
      glow: 'rgba(167, 139, 250, 0.3)',
    },
    emerald: {
      300: '#6ee7b7',
      400: '#10b981',  // Success
      500: '#059669',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    amber: {
      400: '#f59e0b',  // Warning/Busy
      500: '#d97706',
    },
    rose: {
      400: '#f43f5e',  // Error/Offline
      500: '#e11d48',
    },
  },
  
  // Typography - The Mono-Sans duality
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, monospace',
  },
  
  // Typography Scale
  text: {
    hero: 'text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter',
    h1: 'text-3xl sm:text-4xl font-bold tracking-tight',
    h2: 'text-xl sm:text-2xl font-bold',
    h3: 'text-lg font-bold',
    body: 'text-sm sm:text-base font-medium',
    small: 'text-xs font-medium',
    tiny: 'text-[10px] font-bold uppercase tracking-widest',
    mono: 'font-mono text-xs',
    monoSmall: 'font-mono text-[10px]',
  },
  
  // Glassmorphism - The human touch
  glass: {
    background: 'rgba(10, 10, 10, 0.4)',
    backdrop: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderHover: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 4px 24px -1px rgba(0, 0, 0, 0.2)',
    shadowHover: '0 8px 32px -2px rgba(0, 0, 0, 0.3)',
  },
  
  // Spacing - Responsive breathing room
  spacing: {
    page: 'px-3 sm:px-4 lg:px-6',
    pageY: 'py-6 sm:py-8 lg:py-12',
    section: 'mb-6 sm:mb-8 lg:mb-12',
    card: 'p-4 sm:p-6',
    cardLarge: 'p-6 sm:p-8',
    gap: 'gap-3 sm:gap-4',
    gapLarge: 'gap-4 sm:gap-6',
  },
  
  // Border Radius
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  
  // Animation - Staggered with purpose
  animation: {
    // Durations
    fast: 'duration-100',
    normal: 'duration-300',
    slow: 'duration-600',
    
    // Stagger delays (in ms)
    stagger: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    
    // Keyframes
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    
    slideUp: {
      initial: { y: '100%' },
      animate: { y: 0 },
      transition: { type: 'spring', damping: 25, stiffness: 200 },
    },
    
    scale: {
      whileTap: { scale: 0.98 },
      transition: { duration: 0.1 },
    },
    
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
  },
  
  // Status indicators
  status: {
    online: {
      bg: 'bg-emerald-400',
      text: 'text-emerald-400',
      label: '[ACTIVE]',
    },
    busy: {
      bg: 'bg-amber-400',
      text: 'text-amber-400',
      label: '[BUSY]',
    },
    offline: {
      bg: 'bg-white/20',
      text: 'text-white/40',
      label: '[IDLE]',
    },
    error: {
      bg: 'bg-rose-400',
      text: 'text-rose-400',
      label: '[ERROR]',
    },
  },
  
  // Memory type colors
  memoryTypes: {
    file: {
      bg: 'bg-violet-500/20',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
      icon: '📄',
    },
    agent_output: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: '🤖',
    },
    conversation: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      icon: '💬',
    },
    concept: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: '💡',
    },
    code: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      icon: '💻',
    },
    event: {
      bg: 'bg-white/10',
      text: 'text-white/60',
      border: 'border-white/20',
      icon: '📊',
    },
  },
  
  // Z-index layers
  zIndex: {
    background: 0,
    grid: 1,
    content: 10,
    header: 50,
    modal: 100,
    tooltip: 200,
    terminal: 150,
  },
} as const;

// Utility function for glass card class
export const glassCard = (hover: boolean = true) => `
  bg-[${soul.surface[1]}]
  backdrop-blur-[8px]
  border border-[${soul.surface[3]}]
  rounded-2xl
  transition-all duration-300
  ${hover ? 'hover:border-[${soul.surface[4]}] hover:bg-[${soul.surface[2]}] hover:-translate-y-0.5' : ''}
`;

// Utility for status color
export const getStatusColor = (status: 'online' | 'busy' | 'offline' | 'error') => {
  return soul.status[status] || soul.status.offline;
};

// Utility for memory type color
export const getMemoryTypeColor = (type: string) => {
  return soul.memoryTypes[type as keyof typeof soul.memoryTypes] || soul.memoryTypes.event;
};

export default soul;

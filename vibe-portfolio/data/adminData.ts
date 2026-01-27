// ============================================================================
// ADMIN DATA - The Teacher's Bible
// ============================================================================

export interface ComponentInfo {
  name: string;
  path: string;
  description: string;
  status: 'stable' | 'beta' | 'needs-work';
  features: string[];
}

export interface EasterEgg {
  name: string;
  trigger: string;
  location: string;
  description: string;
  reward?: string;
}

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'ai' | 'deployment' | 'styling';
  version?: string;
  description: string;
  docsUrl: string;
}

export interface RoadmapItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  category: string;
}

export interface QuickAction {
  label: string;
  description: string;
  type: 'link' | 'command' | 'external';
  value: string;
  icon: string;
}

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================
export const COMPONENT_REGISTRY: ComponentInfo[] = [
  // Root Components
  {
    name: 'Layout',
    path: '/components/Layout.tsx',
    description: 'Main app layout wrapper with Navbar, BackgroundGrid, and StickyCTA',
    status: 'stable',
    features: ['Responsive', 'Animated background', 'Sticky elements'],
  },
  {
    name: 'Navbar',
    path: '/components/Navbar.tsx',
    description: 'Fixed navigation bar with routes and glowing Enroll CTA',
    status: 'stable',
    features: ['Animated CTA', 'Route highlighting', 'Responsive'],
  },
  {
    name: 'StickyCTA',
    path: '/components/StickyCTA.tsx',
    description: 'Floating CTA banner that appears after scrolling 500px',
    status: 'stable',
    features: ['Scroll trigger', 'Dismissible', 'LocalStorage persistence'],
  },
  {
    name: 'EasterEggHints',
    path: '/components/EasterEggHints.tsx',
    description: 'Floating purple button revealing terminal secrets',
    status: 'stable',
    features: ['Pulse animation', 'Modal overlay', 'First-visit detection'],
  },
  {
    name: 'ErrorBoundary',
    path: '/components/ErrorBoundary.tsx',
    description: 'React error boundary for graceful crash handling',
    status: 'stable',
    features: ['Error catching', 'Fallback UI', 'Recovery button'],
  },
  {
    name: 'PasswordGate',
    path: '/components/PasswordGate.tsx',
    description: 'Session-based password protection for the site',
    status: 'stable',
    features: ['Session storage', 'Terminal aesthetic', 'Password: vibe2024'],
  },
  
  // Artifacts - DeploymentDemo
  {
    name: 'DeploymentDemo',
    path: '/components/artifacts/DeploymentDemo/DeploymentDemo.tsx',
    description: 'Interactive CI/CD pipeline simulation with visual stages',
    status: 'stable',
    features: ['Visual pipeline', 'Confetti celebration', 'Fake metrics', 'Auto-rotation'],
  },
  
  // Artifacts - TerminalContact
  {
    name: 'TerminalContactV2',
    path: '/components/artifacts/TerminalContact/TerminalContactV2.tsx',
    description: 'Terminal contact form with hidden commands and Konami code',
    status: 'stable',
    features: ['Hidden commands', 'Konami code', 'FAQ responses', 'Chat mode'],
  },
  
  // Artifacts - AuthenticatedTerminal
  {
    name: 'AuthenticatedTerminal',
    path: '/components/artifacts/AuthenticatedTerminal/AuthenticatedTerminal.tsx',
    description: 'Username/password auth terminal (vibefounder/apex2024)',
    status: 'stable',
    features: ['Boot sequence', 'Auth flow', 'Portal rendering'],
  },
  
  // Artifacts - CurriculumLog
  {
    name: 'CurriculumLog',
    path: '/components/artifacts/CurriculumLog/CurriculumLog.tsx',
    description: 'Terminal-style curriculum browser with commands',
    status: 'stable',
    features: ['ls/mount/cat commands', 'Boot sequence', 'Module navigation'],
  },
  
  // Artifacts - ToolArsenal
  {
    name: 'ToolArsenal',
    path: '/components/artifacts/ToolArsenal/ToolArsenal.tsx',
    description: 'AI tools showcase with boot animation and CTA',
    status: 'stable',
    features: ['Boot sequence', 'Tool cards', 'Tier badges', 'Navigate to Academy'],
  },
  
  // Artifacts - ParadigmShifter
  {
    name: 'ParadigmShifter',
    path: '/components/artifacts/ParadigmShifter/ParadigmShifter.tsx',
    description: 'Toggle between Legacy and Vibe development paradigms',
    status: 'stable',
    features: ['Before/after comparison', 'Terminal output', 'Cost visualization'],
  },
  
  // UI - Terminal System
  {
    name: 'TerminalWindow',
    path: '/components/ui/Terminal/TerminalWindow.tsx',
    description: 'Reusable terminal window with macOS traffic lights',
    status: 'stable',
    features: ['Traffic lights', 'Title bar', 'Customizable content'],
  },
  {
    name: 'TerminalPortal',
    path: '/components/ui/Terminal/TerminalPortal.tsx',
    description: 'Portal-based terminal overlay with backdrop',
    status: 'stable',
    features: ['Portal rendering', 'Escape to close', 'Body scroll lock'],
  },
  
  // CurriculumModal
  {
    name: 'CurriculumModal',
    path: '/components/CurriculumModal/CurriculumModal.tsx',
    description: 'Full-screen curriculum modal with VS Code-style nav',
    status: 'stable',
    features: ['Tree navigation', 'Markdown rendering', 'Tool badges'],
  },
];

// ============================================================================
// EASTER EGGS
// ============================================================================
export const EASTER_EGGS: EasterEgg[] = [
  {
    name: 'Konami Code',
    trigger: '↑↑↓↓←→←→BA',
    location: 'Anywhere on site (works globally)',
    description: 'The classic Konami code triggers a special discount',
    reward: '10% off with code VIBEKONAMI',
  },
  {
    name: 'Help Command',
    trigger: 'help',
    location: 'Contact Terminal (chat mode)',
    description: 'Shows all available hidden commands in a styled box',
  },
  {
    name: 'Dev Joke',
    trigger: 'joke',
    location: 'Contact Terminal (chat mode)',
    description: 'Random developer joke from 8 rotating jokes',
  },
  {
    name: 'Coffee Break',
    trigger: 'coffee',
    location: 'Contact Terminal (chat mode)',
    description: 'ASCII art coffee cup with caffeine status',
  },
  {
    name: 'Matrix Easter Egg',
    trigger: 'matrix',
    location: 'Contact Terminal (chat mode)',
    description: '"Wake up, Neo..." - Matrix-style ASCII art message',
  },
  {
    name: 'Sudo Access',
    trigger: 'sudo',
    location: 'Contact Terminal (chat mode)',
    description: '"Nice try!" - Humorous access denied response',
  },
  {
    name: 'Vibe Check',
    trigger: 'vibe',
    location: 'Contact Terminal (chat mode)',
    description: 'Random vibe status from 7 variations',
  },
  {
    name: 'About Academy',
    trigger: 'about',
    location: 'Contact Terminal (chat mode)',
    description: 'ASCII box with academy mission and info',
  },
  {
    name: 'Tech Stack',
    trigger: 'stack',
    location: 'Contact Terminal (chat mode)',
    description: 'Full tech stack display in ASCII table',
  },
  {
    name: 'Clear Terminal',
    trigger: 'clear',
    location: 'Contact Terminal (chat mode)',
    description: 'Clears terminal output and resets to chat mode',
  },
  {
    name: 'Purple Sparkle Button',
    trigger: 'Click floating purple button (bottom-right)',
    location: 'All pages',
    description: 'Reveals hints modal with all secret commands',
  },
];

// ============================================================================
// TECH STACK
// ============================================================================
export const TECH_STACK: TechItem[] = [
  // Frontend
  {
    name: 'React',
    category: 'frontend',
    version: '19.2.3',
    description: 'UI framework with latest features (use, Actions, etc)',
    docsUrl: 'https://react.dev',
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    version: '5.8.2',
    description: 'Type-safe JavaScript with strict mode enabled',
    docsUrl: 'https://www.typescriptlang.org/docs/',
  },
  {
    name: 'React Router',
    category: 'frontend',
    version: '6.30.3',
    description: 'Client-side routing with nested routes',
    docsUrl: 'https://reactrouter.com/en/main',
  },
  {
    name: 'Framer Motion',
    category: 'frontend',
    version: '12.29.0',
    description: 'Animation library for React (AnimatePresence, motion)',
    docsUrl: 'https://www.framer.com/motion/',
  },
  {
    name: 'Lucide React',
    category: 'frontend',
    version: '0.562.0',
    description: 'Beautiful hand-crafted icons',
    docsUrl: 'https://lucide.dev/icons/',
  },
  
  // Styling
  {
    name: 'Tailwind CSS',
    category: 'styling',
    version: '3.4.17',
    description: 'Utility-first CSS framework',
    docsUrl: 'https://tailwindcss.com/docs',
  },
  {
    name: 'PostCSS',
    category: 'styling',
    version: '8.4.38',
    description: 'CSS processing with autoprefixer',
    docsUrl: 'https://postcss.org/',
  },
  
  // Deployment
  {
    name: 'Vite',
    category: 'deployment',
    version: '6.2.0',
    description: 'Lightning-fast build tool and dev server',
    docsUrl: 'https://vitejs.dev/guide/',
  },
  {
    name: 'Vercel',
    category: 'deployment',
    description: 'Edge deployment platform (recommended)',
    docsUrl: 'https://vercel.com/docs',
  },
  
  // AI Tools (Curriculum)
  {
    name: 'Claude Code',
    category: 'ai',
    description: 'AI pair programmer - The Architect',
    docsUrl: 'https://claude.ai',
  },
  {
    name: 'Cursor',
    category: 'ai',
    description: 'AI-native IDE - The Builder',
    docsUrl: 'https://cursor.sh',
  },
  {
    name: 'v0.dev',
    category: 'ai',
    description: 'UI generation - The Designer',
    docsUrl: 'https://v0.dev',
  },
];

// ============================================================================
// ROADMAP
// ============================================================================
export const ROADMAP_ITEMS: RoadmapItem[] = [
  // Completed
  {
    title: 'Pricing Page',
    description: 'Full pricing page with monthly/lifetime toggle and comparison table',
    priority: 'high',
    status: 'completed',
    category: 'Conversion',
  },
  {
    title: 'Sticky CTA Bar',
    description: 'Floating bottom CTA that appears on scroll',
    priority: 'high',
    status: 'completed',
    category: 'Conversion',
  },
  {
    title: 'Hidden Terminal Commands',
    description: 'Easter egg commands in contact terminal',
    priority: 'medium',
    status: 'completed',
    category: 'Engagement',
  },
  {
    title: 'Konami Code',
    description: 'Classic game cheat code for discount',
    priority: 'low',
    status: 'completed',
    category: 'Engagement',
  },
  {
    title: 'Visual CI/CD Pipeline',
    description: 'Animated deployment stages in DeploymentDemo',
    priority: 'medium',
    status: 'completed',
    category: 'Demo',
  },
  {
    title: 'Confetti Celebration',
    description: 'Deployment success animation',
    priority: 'low',
    status: 'completed',
    category: 'Demo',
  },
  {
    title: 'Easter Egg Hints Button',
    description: 'Floating button revealing secrets',
    priority: 'medium',
    status: 'completed',
    category: 'Engagement',
  },
  
  // In Progress
  {
    title: 'Admin Dashboard',
    description: "Teacher's bible with all site documentation",
    priority: 'high',
    status: 'in-progress',
    category: 'Admin',
  },
  
  // Planned
  {
    title: 'XP/Level System',
    description: 'Gamification with progress tracking',
    priority: 'high',
    status: 'planned',
    category: 'Engagement',
  },
  {
    title: 'Interactive Skill Tree',
    description: 'RPG-style curriculum visualization',
    priority: 'high',
    status: 'planned',
    category: 'Curriculum',
  },
  {
    title: '3D Tool Constellation',
    description: 'Three.js interactive tool visualization',
    priority: 'medium',
    status: 'planned',
    category: 'Demo',
  },
  {
    title: 'AI Learning Path Generator',
    description: 'Personalized tool stack recommendations',
    priority: 'medium',
    status: 'planned',
    category: 'Curriculum',
  },
  {
    title: 'Social Proof Ticker',
    description: 'Real-time student achievement feed',
    priority: 'medium',
    status: 'planned',
    category: 'Conversion',
  },
  {
    title: 'Payment Integration',
    description: 'Stripe checkout for enrollments',
    priority: 'high',
    status: 'planned',
    category: 'Conversion',
  },
  {
    title: 'Student Dashboard',
    description: 'Progress tracking and achievements',
    priority: 'high',
    status: 'planned',
    category: 'Features',
  },
  {
    title: 'Mobile Terminal UX',
    description: 'Better terminal experience on mobile',
    priority: 'medium',
    status: 'planned',
    category: 'UX',
  },
  {
    title: 'Code Splitting',
    description: 'Reduce bundle size with dynamic imports',
    priority: 'medium',
    status: 'planned',
    category: 'Performance',
  },
];

// ============================================================================
// QUICK ACTIONS
// ============================================================================
export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'View Pricing',
    description: 'Check the pricing page',
    type: 'link',
    value: '/pricing',
    icon: 'CreditCard',
  },
  {
    label: 'Test Contact Form',
    description: 'Try the terminal contact',
    type: 'link',
    value: '/contact',
    icon: 'MessageSquare',
  },
  {
    label: 'Academy Page',
    description: 'Browse the curriculum',
    type: 'link',
    value: '/academy',
    icon: 'GraduationCap',
  },
  {
    label: 'Run Dev Server',
    description: 'npm run dev',
    type: 'command',
    value: 'npm run dev',
    icon: 'Play',
  },
  {
    label: 'Build Production',
    description: 'npm run build',
    type: 'command',
    value: 'npm run build',
    icon: 'Package',
  },
  {
    label: 'GitHub Repo',
    description: 'View source code',
    type: 'external',
    value: 'https://github.com',
    icon: 'Github',
  },
  {
    label: 'Vercel Dashboard',
    description: 'Deployment status',
    type: 'external',
    value: 'https://vercel.com/dashboard',
    icon: 'Cloud',
  },
  {
    label: 'Tailwind Docs',
    description: 'CSS reference',
    type: 'external',
    value: 'https://tailwindcss.com/docs',
    icon: 'Palette',
  },
];

// ============================================================================
// SITE STATS
// ============================================================================
export const SITE_STATS = {
  totalComponents: 56,
  totalPages: 8,
  totalHooks: 2,
  totalDataFiles: 4,
  bundleSize: '1.78 MB',
  cssSize: '66 KB',
  easterEggs: 11,
  toolsInCurriculum: 12,
  modulesInCurriculum: 6,
  lastUpdated: '2026-01-25',
};

// ============================================================================
// CREDENTIALS (for reference)
// ============================================================================
export const CREDENTIALS = {
  sitePassword: 'vibe2024',
  academyLogin: {
    username: 'vibefounder',
    password: 'apex2024',
  },
  adminPassword: 'apex2024admin',
  konamiCode: 'VIBEKONAMI (10% off)',
};

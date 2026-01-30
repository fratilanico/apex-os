import React, { useState, useDeferredValue } from 'react';
import { Zap, MessageSquare, Workflow, ArrowRight, Sparkles, Users, Layers } from 'lucide-react';
import { MindsetCard } from '../components/VibePage';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MINDSETS = [
  {
    number: '1',
    title: 'Autocomplete',
    description: 'AI suggests the next line. You hit tab. You\'re still writing every function.',
    icon: Zap,
    features: [
      'Faster typing, same workflow',
      'You remain the bottleneck',
      'Incremental productivity gains',
    ],
    status: 'deprecated' as const,
  },
  {
    number: '2',
    title: 'Chatbot',
    description: 'You prompt, AI generates, you review. Delegating features instead of lines.',
    icon: MessageSquare,
    features: [
      'Generate entire components at once',
      'Still requires constant oversight',
      'Loses context after 10 messages',
    ],
    status: 'limited' as const,
  },
  {
    number: '3',
    title: 'Orchestrator',
    description: 'Design systems where specialized agents collaborate. You architect, they execute.',
    icon: Workflow,
    features: [
      'Multiple agents work in parallel',
      'Automatic handoffs and verification',
      'Context persists across workflows',
    ],
    status: 'current' as const,
  },
];

const OLD_WAY_ITEMS = [
  { icon: '💬', text: 'You write prompts for every task', sub: 'Manual, repetitive, exhausting' },
  { icon: '🧠', text: 'AI forgets context constantly', sub: 'Start from scratch each time' },
  { icon: '👀', text: 'You review every line of code', sub: 'Quality control is on you' },
  { icon: '⏸️', text: 'Work stops when you stop', sub: 'Zero parallelization' },
] as const;

const NEW_WAY_ITEMS = [
  { icon: '🎯', text: 'Design workflows once', sub: 'Reusable, systematic, scalable' },
  { icon: '🔄', text: 'Agents maintain context automatically', sub: 'State persists across sessions' },
  { icon: '✅', text: 'Review verified outcomes', sub: 'Agents check each other' },
  { icon: '⚡', text: 'Agents work in parallel 24/7', sub: 'True parallelization' },
] as const;

const BEFORE_ITEMS = [
  'You write prompts for every task',
  'AI forgets context every session',
  'You review every line of code',
  'Work stops when you stop',
] as const;

const AFTER_ITEMS = [
  'You design agent workflows once',
  'Agents maintain context automatically',
  'You review verified outcomes',
  'Agents work in parallel 24/7',
] as const;

const BACKEND_SCANLINE_STYLE: React.CSSProperties = {
  background: 'linear-gradient(rgba(139,92,246,0.03) 50%, transparent 50%)',
  backgroundSize: '100% 4px',
};

const TESTING_SCANLINE_STYLE: React.CSSProperties = {
  background: 'linear-gradient(rgba(16,185,129,0.03) 50%, transparent 50%)',
  backgroundSize: '100% 4px',
};

export const VibePage: React.FC = () => {

  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<'before' | 'after'>('before');
  const deferredView = useDeferredValue(selectedView);

  return (
    <main className="relative z-10 px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto pb-16 overflow-x-hidden w-full">
      {/* Hero Section - Interactive Paradigm Shift */}
      <section className="max-w-4xl mx-auto pt-2 sm:pt-4 pb-8 sm:pb-16 relative">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            className="absolute top-20 right-1/4 w-80 h-80 bg-violet-500 rounded-full blur-[100px]"
          />
        </div>

        <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white/90 mb-1 sm:mb-2">
              From Prompting to
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 animate-gradient">
              Orchestrating
            </h1>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm sm:text-base md:text-lg text-white/60 mt-6 sm:mt-8 max-w-2xl mx-auto text-center leading-relaxed px-2 sm:px-0"
        >
          The shift from asking AI to do tasks to{' '}
          <span className="text-cyan-400 font-semibold">designing systems where agents collaborate</span>
          {' '}is what separates founders who ship in weeks from those stuck in months.
        </motion.p>

        {/* Interactive Comparison Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12"
        >
          {/* Toggle Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-0">
            <button
              onClick={() => setSelectedView('before')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-300 min-h-[44px] ${
                selectedView === 'before'
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border border-red-500/30 shadow-lg shadow-red-500/20'
                  : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
              }`}
            >
              Old Way
            </button>
            <button
              onClick={() => setSelectedView('after')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-300 min-h-[44px] ${
                selectedView === 'after'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
              }`}
            >
              New Way
            </button>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-2 sm:px-0">
            {/* OLD WAY */}
            <motion.div
              initial={false}
              animate={{
                opacity: deferredView === 'before' ? 1 : 0.4,
                scale: deferredView === 'before' ? 1 : 0.95,
                filter: deferredView === 'before' ? 'blur(0px)' : 'blur(2px)',
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="rounded-2xl p-4 sm:p-6 md:p-8 border border-red-500/30 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent relative overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="inline-flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/20 border border-red-500/30 items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Prompting AI</h3>
                      <p className="text-xs text-red-400 font-mono">BOTTLENECK_MODE</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {OLD_WAY_ITEMS.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-black/20 rounded-lg p-3 sm:p-4 border border-red-500/20"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-xl sm:text-2xl">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white/80 font-medium text-xs sm:text-sm">{item.text}</p>
                            <p className="text-white/40 text-[10px] sm:text-xs mt-1">{item.sub}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-red-500/20">
                    <div className="text-center">
                      <p className="text-red-400 font-bold text-base sm:text-lg">Result: Slow</p>
                      <p className="text-white/40 text-xs mt-1">Months to MVP</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NEW WAY */}
            <motion.div
              initial={false}
              animate={{
                opacity: deferredView === 'after' ? 1 : 0.4,
                scale: deferredView === 'after' ? 1 : 0.95,
                filter: deferredView === 'after' ? 'blur(0px)' : 'blur(2px)',
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="rounded-2xl p-4 sm:p-6 md:p-8 border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-emerald-500/5 relative overflow-hidden group">
                {/* Hover Glow */}
                <motion.div
                  animate={{
                    opacity: deferredView === 'after' ? 0.5 : 0.2,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-transparent"
                />
                
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="inline-flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 items-center justify-center flex-shrink-0">
                      <Workflow className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">Orchestrating Agents</h3>
                      <p className="text-xs text-cyan-400 font-mono">SCALE_MODE</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {NEW_WAY_ITEMS.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-black/20 rounded-lg p-3 sm:p-4 border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-xl sm:text-2xl">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white/90 font-medium text-xs sm:text-sm">{item.text}</p>
                            <p className="text-cyan-400/60 text-[10px] sm:text-xs mt-1">{item.sub}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-cyan-500/20">
                    <div className="text-center">
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-bold text-base sm:text-lg">
                        Result: 10x Faster
                      </p>
                      <p className="text-white/60 text-xs mt-1">Weeks to MVP</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Visual Metaphor - Premium Agent Network */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 sm:mt-16"
        >
          <div className="text-center mb-6 sm:mb-8 px-2 sm:px-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              You Become the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Architect</span>
            </h3>
            <p className="text-white/50 text-xs sm:text-sm">3 agents working in parallel = 10x faster execution</p>
          </div>

          {/* Premium Agent Cards with Terminal Aesthetic */}
          <div className="relative max-w-5xl mx-auto">
            {/* Animated Data Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
              {/* Flow from orchestrator to agents */}
              <defs>
                <linearGradient id="flow-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="flow-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="flow-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Animated flow particles */}
              <motion.circle
                r="1.5"
                fill="#22d3ee"
                filter="url(#glow)"
                initial={{ cx: 10, cy: 50, opacity: 0 }}
                animate={{
                  cx: [10, 90],
                  cy: [30, 70],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0,
                }}
              />
              <motion.circle
                r="1.5"
                fill="#a78bfa"
                filter="url(#glow)"
                initial={{ cx: 10, cy: 50, opacity: 0 }}
                animate={{
                  cx: [10, 90],
                  cy: [50, 50],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />
              <motion.circle
                r="1.5"
                fill="#10b981"
                filter="url(#glow)"
                initial={{ cx: 10, cy: 50, opacity: 0 }}
                animate={{
                  cx: [10, 90],
                  cy: [70, 30],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
              />
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 relative z-10 px-2 sm:px-0">
              {/* Frontend Agent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                onHoverStart={() => setHoveredPhase(0)}
                onHoverEnd={() => setHoveredPhase(null)}
                className="group relative"
              >
                {/* Hover border gradient */}
                <motion.div
                  className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-400/40 to-cyan-500/40 rounded-xl blur-sm"
                  animate={{
                    opacity: hoveredPhase === 0 ? 0.7 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-xl overflow-hidden">
                  {/* Terminal Header */}
                  <div className="px-3 py-2 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-500/60 shadow-[0_0_6px_rgba(34,211,238,0.4)]"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-400/40"></div>
                        <div className="w-2 h-2 rounded-full bg-cyan-300/30"></div>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-400/80 tracking-wider uppercase font-bold">frontend.agent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                      <span className="text-[8px] font-mono text-cyan-400/60">ACTIVE</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Icon Badge */}
                    <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0" strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Frontend Agent</h4>
                      <p className="text-[10px] font-mono text-cyan-400/60">REACT_SPECIALIST</p>
                    </div>

                    {/* Code Snippet */}
                    <div className="rounded-md bg-black/60 border border-cyan-500/20 p-2.5 font-mono text-[10px] leading-relaxed">
                      <div className="text-cyan-400/50">// Parallel execution</div>
                      <div className="text-white/90">Building <span className="text-cyan-400">components</span></div>
                      <div className="text-white/90">Styling <span className="text-cyan-400">UI</span></div>
                      <div className="text-emerald-400">✓ <span className="text-white/70">Ready in 23s</span></div>
                    </div>

                    {/* Stats */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Speed</span>
                        <span className="text-cyan-400 font-mono">10x faster</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Output</span>
                        <span className="text-white/70 font-mono">React + Tailwind</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* Backend Agent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                onHoverStart={() => setHoveredPhase(1)}
                onHoverEnd={() => setHoveredPhase(null)}
                className="group relative"
              >
                {/* Hover border gradient */}
                <motion.div
                  className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/40 via-violet-400/40 to-violet-500/40 rounded-xl blur-sm"
                  animate={{
                    opacity: hoveredPhase === 1 ? 0.7 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative rounded-xl border border-violet-500/30 bg-black/40 backdrop-blur-xl overflow-hidden">
                  {/* Terminal Header */}
                  <div className="px-3 py-2 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-violet-500/60 shadow-[0_0_6px_rgba(167,139,250,0.4)]"></div>
                        <div className="w-2 h-2 rounded-full bg-violet-400/40"></div>
                        <div className="w-2 h-2 rounded-full bg-violet-300/30"></div>
                      </div>
                      <span className="text-[9px] font-mono text-violet-400/80 tracking-wider uppercase font-bold">backend.agent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.3,
                        }}
                      />
                      <span className="text-[8px] font-mono text-violet-400/60">ACTIVE</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Icon Badge */}
                    <div className="inline-flex w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-violet-400 flex-shrink-0" strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Backend Agent</h4>
                      <p className="text-[10px] font-mono text-violet-400/60">API_ARCHITECT</p>
                    </div>

                    {/* Code Snippet */}
                    <div className="rounded-md bg-black/60 border border-violet-500/20 p-2.5 font-mono text-[10px] leading-relaxed">
                      <div className="text-violet-400/50">// Shipping APIs</div>
                      <div className="text-white/90">Creating <span className="text-violet-400">endpoints</span></div>
                      <div className="text-white/90">Setting <span className="text-violet-400">auth</span></div>
                      <div className="text-emerald-400">✓ <span className="text-white/70">Deployed 18s</span></div>
                    </div>

                    {/* Stats */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Speed</span>
                        <span className="text-violet-400 font-mono">10x faster</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Output</span>
                        <span className="text-white/70 font-mono">Scalable APIs</span>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={BACKEND_SCANLINE_STYLE}
                      animate={{
                        opacity: hoveredPhase === 1 ? 1 : 0,
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Testing Agent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                onHoverStart={() => setHoveredPhase(2)}
                onHoverEnd={() => setHoveredPhase(null)}
                className="group relative"
              >
                {/* Hover border gradient */}
                <motion.div
                  className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/40 via-emerald-400/40 to-emerald-500/40 rounded-xl blur-sm"
                  animate={{
                    opacity: hoveredPhase === 2 ? 0.7 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative rounded-xl border border-emerald-500/30 bg-black/40 backdrop-blur-xl overflow-hidden">
                  {/* Terminal Header */}
                  <div className="px-3 py-2 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.4)]"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400/40"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-300/30"></div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400/80 tracking-wider uppercase font-bold">testing.agent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.6,
                        }}
                      />
                      <span className="text-[8px] font-mono text-emerald-400/60">ACTIVE</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Icon Badge */}
                    <div className="inline-flex w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Testing Agent</h4>
                      <p className="text-[10px] font-mono text-emerald-400/60">QUALITY_GUARD</p>
                    </div>

                    {/* Code Snippet */}
                    <div className="rounded-md bg-black/60 border border-emerald-500/20 p-2.5 font-mono text-[10px] leading-relaxed">
                      <div className="text-emerald-400/50">// Auto verification</div>
                      <div className="text-white/90">Running <span className="text-emerald-400">tests</span></div>
                      <div className="text-white/90">Checking <span className="text-emerald-400">quality</span></div>
                      <div className="text-emerald-400">✓ <span className="text-white/70">Verified 12s</span></div>
                    </div>

                    {/* Stats */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Speed</span>
                        <span className="text-emerald-400 font-mono">10x faster</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40">Output</span>
                        <span className="text-white/70 font-mono">Full Coverage</span>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={TESTING_SCANLINE_STYLE}
                      animate={{
                        opacity: hoveredPhase === 2 ? 1 : 0,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

              {/* Social Proof Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-4 sm:mt-6 rounded-xl border border-white/10 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5 backdrop-blur-sm p-3 sm:p-4"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-center md:text-left">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="inline-flex w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-white/10 items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 flex-shrink-0" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Total time: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">53 seconds</span>
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-white/40 font-mono">What used to take 3 engineers 2 weeks</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 text-xs flex-wrap justify-center">
                  <div className="text-center">
                    <p className="text-white/40">Cost</p>
                    <p className="font-mono text-cyan-400">$2.40</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div className="text-center">
                    <p className="text-white/40">Equity Given</p>
                    <p className="font-mono text-emerald-400">0%</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div className="text-center">
                    <p className="text-white/40">Used by</p>
                    <p className="font-mono text-violet-400">500+ founders</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center text-white/60 text-xs sm:text-sm mt-6 sm:mt-8 max-w-2xl mx-auto px-2 sm:px-0"
          >
            Stop being a prompt engineer. Start being a <span className="text-cyan-400 font-semibold">systems architect</span>.
            <br />
            <span className="text-white/40 text-[10px] sm:text-xs">Design once. Deploy instantly. Scale infinitely.</span>
          </motion.p>
        </motion.div>
      </section>

      {/* The Three Mindsets */}
      <section className="pb-10">
        <div className="text-center max-w-2xl mx-auto mb-6 px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            The Evolution
          </h2>
          <p className="text-xs sm:text-sm text-white/50">
            From typing faster to building faster. From prompting to orchestrating.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto px-2 sm:px-0">
          {MINDSETS.map((mindset) => (
            <MindsetCard key={mindset.number} {...mindset} />
          ))}
        </div>
      </section>

      {/* The Technical Co-Founder Tax */}
      <section className="pb-10 px-2 sm:px-0">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
            The Technical Co-Founder Tax
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Traditional Route */}
            <div className="rounded-xl p-3 sm:p-4 md:p-6 border border-red-500/20 bg-red-500/5">
              <div className="text-red-400 font-mono text-xs uppercase mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                Traditional Route
              </div>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/60">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/60 whitespace-normal">Find technical co-founder:</span>
                  <span className="text-white/80 font-medium whitespace-nowrap">3-6 months</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/60 whitespace-normal">Equity given:</span>
                  <span className="text-white/80 font-medium whitespace-nowrap">20-30%</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/60 whitespace-normal">Annual salary (if paying):</span>
                  <span className="text-white/80 font-medium whitespace-nowrap">$150K-200K</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/60 whitespace-normal">Time to MVP:</span>
                  <span className="text-white/80 font-medium whitespace-nowrap">3-6 months</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/60 whitespace-normal">Risk they quit:</span>
                  <span className="text-red-400 font-medium whitespace-nowrap">High</span>
                </div>
              </div>
            </div>

            {/* Vibe Route */}
            <div className="rounded-xl p-3 sm:p-4 md:p-6 border border-cyan-500/20 bg-cyan-500/5">
              <div className="text-cyan-400 font-mono text-xs uppercase mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                Vibe Route
              </div>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/70">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/70 whitespace-normal">Learn orchestration:</span>
                  <span className="text-white/90 font-medium whitespace-nowrap">2-3 weeks</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/70 whitespace-normal">Equity given:</span>
                  <span className="text-white/90 font-medium whitespace-nowrap">0%</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/70 whitespace-normal">Monthly cost:</span>
                  <span className="text-white/90 font-medium whitespace-nowrap">$200-500</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/70 whitespace-normal">Time to MVP:</span>
                  <span className="text-white/90 font-medium whitespace-nowrap">2-4 weeks</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                  <span className="text-white/70 whitespace-normal">Risk AI quits:</span>
                  <span className="text-cyan-400 font-medium whitespace-nowrap">Zero</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-white/50 text-xs sm:text-sm px-2">
            Most founders burn equity or cash before they validate product-market fit.
            <span className="text-cyan-400"> The Vibe approach lets you ship first, raise later.</span>
          </p>
        </div>
      </section>

      {/* The Shift - Redesigned */}
      <section className="pb-10 px-2 sm:px-0">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">The Shift</h3>
          <p className="text-xs sm:text-sm text-white/50">What changes when you move from chatbot to orchestrator</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {/* Before */}
          <div className="rounded-xl p-4 sm:p-5 border border-red-500/20 bg-red-500/5">
            <div className="text-red-400 font-mono text-xs uppercase mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              Before
            </div>
            <div className="space-y-2 sm:space-y-3">
               {BEFORE_ITEMS.map((item, idx) => (
                 <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                   <span className="text-red-400 mt-0.5">×</span>
                   <span className="break-words">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* After */}
          <div className="rounded-xl p-4 sm:p-5 border border-cyan-500/20 bg-cyan-500/5">
            <div className="text-cyan-400 font-mono text-xs uppercase mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              After
            </div>
            <div className="space-y-2 sm:space-y-3">
               {AFTER_ITEMS.map((item, idx) => (
                 <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                   <span className="text-cyan-400 mt-0.5">✓</span>
                   <span className="break-words">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant cyan links */}
      <section className="text-center py-8 sm:py-10 border-t border-white/5 px-3 sm:px-4">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Learn the Framework
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mb-4 sm:mb-6">
          The mindset is just the beginning. Master the methodology and tools.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <Link
            to="/approach"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors whitespace-nowrap min-h-[44px]"
          >
            <span>See the Approach</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
          <Link
            to="/academy"
            className="text-xs sm:text-sm text-white/40 hover:text-white/60 transition-colors whitespace-nowrap min-h-[44px]"
          >
            Explore the Academy
          </Link>
        </div>
      </section>
    </main>
  );
};

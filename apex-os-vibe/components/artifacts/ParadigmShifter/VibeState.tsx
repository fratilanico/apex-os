import React from 'react';
import { motion } from 'framer-motion';
import { TerminalOutput } from './TerminalOutput';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

const vibeTerminalLines = [
  { text: '# System Logs', type: 'comment' as const },
  { text: '→ initializing_swarm_agents...', type: 'default' as const },
  { text: '→ agent_1: generating_frontend [DONE]', type: 'success' as const },
  { text: '→ agent_2: writing_tests [DONE]', type: 'success' as const },
  { text: 'SUCCESS: Deployment ready in 42s.', type: 'success' as const },
];

export const VibeState = React.memo(function VibeState() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Left Side - Content */}
      <motion.div variants={itemVariants} className="flex flex-col gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full w-fit">
          <span className="text-cyan-400 text-lg">✓</span>
          <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest">
            CURRENT META
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          The Orchestrator
        </h2>

        {/* Bullet Points */}
        <div className="flex flex-col gap-4 mt-4">
          <BulletPoint text="You architect, Agents execute." />
          <BulletPoint text="Parallel execution streams." />
          <BulletPoint text="Bottleneck: Your imagination." />
        </div>

        {/* Additional Context */}
        <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
          <p className="text-white/60 text-sm leading-relaxed">
            Vibe Coders operate at the <span className="text-cyan-400 font-mono">system level</span>.
            You define the architecture, agents build in parallel. Your role: conductor, not typist.
          </p>
        </div>
      </motion.div>

      {/* Right Side - Terminal */}
      <motion.div variants={itemVariants}>
        <TerminalOutput
          title="orchestrator_logs.sh"
          lines={vibeTerminalLines}
          accentColor="cyan"
        />
      </motion.div>
    </motion.div>
  );
});

const BulletPoint: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3 group">
    <div className="mt-1.5 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition-colors">
      <svg
        className="w-3 h-3 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="text-white/80 text-lg leading-relaxed group-hover:text-white/90 transition-colors">
      {text}
    </p>
  </div>
);

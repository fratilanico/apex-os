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

const legacyTerminalLines = [
  { text: '# Terminal Output', type: 'comment' as const },
  { text: '> git commit -m "fix syntax error"', type: 'default' as const },
  { text: '> npm run build', type: 'default' as const },
  { text: 'Error: undefined is not a function', type: 'error' as const },
  { text: '// debugging for 4 hours...', type: 'comment' as const },
];

const LegacyStateComponent: React.FC = () => {
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full w-fit">
          <span className="text-red-400 text-lg">⊗</span>
          <span className="text-red-400 font-mono text-xs font-bold tracking-widest">
            DEPRECATED MINDSET
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          The Autocomplete Trap
        </h2>

        {/* Bullet Points */}
        <div className="flex flex-col gap-4 mt-4">
          <BulletPoint text="You type, AI suggests line-by-line." />
          <BulletPoint text="80% of time spent reviewing syntax." />
          <BulletPoint text="Bottleneck: Your typing speed." />
        </div>

        {/* Additional Context */}
        <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
          <p className="text-white/60 text-sm leading-relaxed">
            Traditional autocomplete treats AI as <span className="text-red-400 font-mono">glorified snippet engine</span>.
            You're still the bottleneck, manually assembling code like LEGO bricks.
          </p>
        </div>
      </motion.div>

      {/* Right Side - Terminal */}
      <motion.div variants={itemVariants}>
        <TerminalOutput
          title="legacy_workflow.sh"
          lines={legacyTerminalLines}
          accentColor="red"
        />
      </motion.div>
    </motion.div>
  );
};

export const LegacyState = React.memo(LegacyStateComponent);

const BulletPoint: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3 group">
    <div className="mt-1.5 w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors">
      <svg
        className="w-3 h-3 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <p className="text-white/80 text-lg leading-relaxed group-hover:text-white/90 transition-colors">
      {text}
    </p>
  </div>
);

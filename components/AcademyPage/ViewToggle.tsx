import React from 'react';
import { Grid3x3, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ViewToggleProps {
  activeView: 'grid' | 'terminal';
  onViewChange: (view: 'grid' | 'terminal') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <button
        onClick={() => onViewChange('grid')}
        className={`
          relative px-4 py-2 rounded-lg font-medium text-sm transition-all
          flex items-center gap-2
          ${
            activeView === 'grid'
              ? 'text-cyan-400'
              : 'text-white/40 hover:text-white/60'
          }
        `}
      >
        {activeView === 'grid' && (
          <motion.div
            layoutId="active-view"
            className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Grid3x3 className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Grid View</span>
      </button>

      <button
        onClick={() => onViewChange('terminal')}
        className={`
          relative px-4 py-2 rounded-lg font-medium text-sm transition-all
          flex items-center gap-2
          ${
            activeView === 'terminal'
              ? 'text-cyan-400'
              : 'text-white/40 hover:text-white/60'
          }
        `}
      >
        {activeView === 'terminal' && (
          <motion.div
            layoutId="active-view"
            className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <Terminal className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Terminal View</span>
      </button>
    </div>
  );
};

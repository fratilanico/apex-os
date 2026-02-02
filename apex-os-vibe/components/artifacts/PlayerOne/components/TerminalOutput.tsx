'use client';

import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ApexTerminalLine } from '@/lib/terminal/types';
import { NeuralPixelBranding } from './NeuralPixelBranding';

interface TerminalOutputProps {
  lines: ApexTerminalLine[];
  isProcessing: boolean;
  className?: string;
}

const getLineStyles = (type: ApexTerminalLine['type']): string => {
  switch (type) {
    case 'input':
      return 'text-cyan-400 font-mono';
    case 'error':
      return 'text-red-400 font-mono';
    case 'output':
      return 'text-emerald-400 font-mono';
    case 'system':
      return 'text-zinc-300 font-mono';
    case 'branding':
      return 'text-cyan-400 font-mono whitespace-pre';
    case 'ai':
      return 'text-emerald-300 font-mono';
    default:
      return 'text-zinc-300 font-mono';
  }
};

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  ({ lines, isProcessing, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent ${className}`}
      >
        <AnimatePresence mode="popLayout">
          {lines.map((line, index) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className={getLineStyles(line.type)}
            >
              {line.type === 'branding' ? (
                <NeuralPixelBranding isAuthorized={true} />
              ) : (
                <span className="text-sm leading-relaxed">
                  {typeof line.content === 'string' ? line.content : line.content}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-cyan-400/60"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-mono animate-pulse">Processing...</span>
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    );
  }
);

TerminalOutput.displayName = 'TerminalOutput';

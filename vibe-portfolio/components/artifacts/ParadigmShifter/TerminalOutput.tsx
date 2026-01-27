import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TerminalWindow } from '../../ui/Terminal';

interface TerminalOutputProps {
  title: string;
  lines: Array<{
    text: string;
    type?: 'default' | 'error' | 'success' | 'comment';
    delay?: number;
  }>;
  accentColor: 'red' | 'cyan';
  maxLines?: number;
}

const getLineColor = (type: string = 'default', accentColor: 'red' | 'cyan') => {
  switch (type) {
    case 'error':
      return 'text-red-400';
    case 'success':
      return 'text-emerald-400';
    case 'comment':
      return 'text-white/40';
    default:
      return accentColor === 'cyan' ? 'text-cyan-400/90' : 'text-red-400/90';
  }
};

const TerminalOutputComponent: React.FC<TerminalOutputProps> = ({
  title,
  lines,
  accentColor,
  maxLines = 100,
}) => {
  // OPTIMIZATION: Slice lines to prevent rendering thousands of DOM nodes
  // This prevents the "freeze" when switching modes with heavy history
  const { visibleLines, hiddenCount } = useMemo(() => {
    if (lines.length <= maxLines) {
      return { visibleLines: lines, hiddenCount: 0 };
    }
    return { 
      visibleLines: lines.slice(-maxLines), 
      hiddenCount: lines.length - maxLines 
    };
  }, [lines, maxLines]);

  return (
    <TerminalWindow title={title} className="h-full" showScanline={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-2"
      >
        {hiddenCount > 0 && (
          <div className="font-mono text-xs text-white/30 italic px-1 select-none">
            ... {hiddenCount} lines hidden for performance ...
          </div>
        )}
        
        {visibleLines.map((line, index) => (
          <div
            key={index} // Note: using index is safe here as lines are static per render in this context
            className={`font-mono text-sm ${getLineColor(line.type, accentColor)}`}
          >
            {line.text}
          </div>
        ))}
      </motion.div>
    </TerminalWindow>
  );
};

export const TerminalOutput = React.memo(TerminalOutputComponent);

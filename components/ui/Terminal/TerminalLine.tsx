import React from 'react';
import { motion } from 'framer-motion';
import { TerminalLine as ITerminalLine } from '../../../hooks/useTerminal';

interface TerminalLineProps extends ITerminalLine {
  showPrompt?: boolean;
  className?: string;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({ 
  text, 
  type, 
  showPrompt = false,
  className = "" 
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-emerald-400 glow-text-emerald';
      case 'system': return 'text-violet-400';
      case 'header': return 'text-white font-bold text-base mb-2';
      case 'input': return 'text-cyan-400';
      default: return 'text-white/80';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-3 leading-relaxed ${getTypeColor()} ${className}`}
    >
      {showPrompt && <span className="text-cyan-500/50 shrink-0">❯</span>}
      <span className="whitespace-pre-wrap">{text}</span>
    </motion.div>
  );
};

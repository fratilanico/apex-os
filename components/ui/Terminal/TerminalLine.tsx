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
      case 'error': return 'text-rose-300';
      case 'success': return 'text-emerald-300';
      case 'system': return 'text-slate-200/80';
      case 'header': return 'text-slate-100 font-semibold text-base mb-2';
      case 'input': return 'text-cyan-300';
      default: return 'text-slate-200/90';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`flex gap-3 leading-relaxed ${getTypeColor()} ${className}`}
    >
      {showPrompt && <span className="text-cyan-300/60 shrink-0">❯</span>}
      <span className="whitespace-pre-wrap">{text}</span>
    </motion.div>
  );
};

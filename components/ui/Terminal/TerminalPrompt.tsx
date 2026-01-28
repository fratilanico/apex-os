import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TerminalPromptProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
  prefix?: string;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({ 
  onCommand, 
  disabled = false,
  prefix = "architect" 
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onCommand(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-4 items-center">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-emerald-500 font-bold">{prefix}</span>
        <span className="text-white/30 font-bold">@</span>
        <span className="text-cyan-400 font-bold">vibe-academy</span>
        <span className="text-white/30">:</span>
        <span className="text-violet-400 font-bold">~</span>
        <span className="text-cyan-500 font-bold shrink-0 ml-1">❯</span>
      </div>
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent border-none outline-none text-cyan-400 font-mono caret-transparent"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        {/* Custom Caret */}
        {!disabled && (
          <motion.div
            style={{ 
              left: `${value.length * 0.6}em`, 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute w-2 h-4 bg-cyan-400 pointer-events-none"
          />
        )}
      </div>
    </form>
  );
};

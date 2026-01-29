import React, { useState } from 'react';

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
        <span className="text-emerald-300 font-semibold">{prefix}</span>
        <span className="text-slate-400 font-semibold">@</span>
        <span className="text-cyan-300 font-semibold">vibe-academy</span>
        <span className="text-slate-500">:</span>
        <span className="text-slate-300 font-semibold">~</span>
        <span className="text-cyan-300 font-semibold shrink-0 ml-1">❯</span>
      </div>
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent border-none outline-none text-cyan-200 font-mono caret-cyan-300"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </form>
  );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu } from 'lucide-react';
import { UI_LABELS, SYSTEM_MESSAGES } from '@/lib/terminal/constants';

interface TerminalHeaderProps {
  className?: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-cyan-500/20 ${className}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-cyan-500/30"
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-cyan-400 tracking-wider">
            {SYSTEM_MESSAGES.APEX_OS}
          </span>
          <span className="text-xs text-zinc-500">
            {UI_LABELS.CORE_TYPE}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">
            {UI_LABELS.SECURITY_STATUS}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-zinc-300">{UI_LABELS.CORE}</span>
            <span className="text-[10px] text-zinc-500">{UI_LABELS.CORE_TYPE}</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-400"
        />
      </div>
    </motion.div>
  );
};

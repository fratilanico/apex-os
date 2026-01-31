'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { UI_LABELS } from '@/lib/terminal/constants';

interface PlayerOneBadgeProps {
  level?: number;
  xp?: number;
  maxXp?: number;
  credits?: number;
  className?: string;
}

export const PlayerOneBadge: React.FC<PlayerOneBadgeProps> = ({
  level = 1,
  xp = 0,
  maxXp = 1000,
  credits = 300,
  className = '',
}) => {
  const xpPercentage = Math.min(100, Math.max(0, (xp / maxXp) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-zinc-900/80 border border-cyan-500/20 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-cyan-500/30"
          >
            <Trophy className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-cyan-400">
              {UI_LABELS.PLAYER_ONE}
            </h3>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Star className="w-3 h-3 text-emerald-400" />
              <span>Level {level}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <Zap className="w-3 h-3" />
            <span>${credits}</span>
          </div>
          <span className="text-[10px] text-zinc-500">{UI_LABELS.CREDITS}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 flex items-center gap-1">
            <Target className="w-3 h-3" />
            XP Progress
          </span>
          <span className="text-cyan-400">{xp} / {maxXp}</span>
        </div>
        
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
          />
        </div>
        
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>0%</span>
          <span>{Math.round(xpPercentage)}%</span>
          <span>100%</span>
        </div>
      </div>
    </motion.div>
  );
};

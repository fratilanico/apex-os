import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Clock } from 'lucide-react';

interface BentoCardProps {
  number: string;
  title: string;
  subtitle: string;
  duration: string;
  objective: string;
  icon: LucideIcon;
  sectionCount: number;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  number,
  title,
  subtitle,
  duration,
  objective,
  icon: Icon,
  sectionCount,
  onClick,
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      className="rounded-xl p-5 text-left relative overflow-hidden group border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-200"
    >
      {/* Module Number Badge */}
      <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
        <span className="text-[10px] font-mono text-white/50">MODULE_{number}</span>
      </div>

      {/* Icon */}
      <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 items-center justify-center mb-4 flex-shrink-0">
        <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-cyan-400 transition-colors pr-16">
        {title}
      </h3>
      <p className="text-xs text-white/40 mb-3">{subtitle}</p>

      {/* Objective */}
      <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-4">
        {objective}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/5 text-xs text-white/40">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{duration}</span>
        </div>
        <span>{sectionCount} {sectionCount === 1 ? 'section' : 'sections'}</span>
      </div>
    </motion.button>
  );
};

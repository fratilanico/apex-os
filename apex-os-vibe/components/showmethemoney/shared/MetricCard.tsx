import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  value: React.ReactNode;
  label: string;
  sublabel?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

const colorMap = {
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    glow: 'shadow-cyan-400/20',
  },
  violet: {
    text: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    glow: 'shadow-violet-400/20',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    glow: 'shadow-emerald-400/20',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'shadow-amber-400/20',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    glow: 'shadow-rose-400/20',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  sublabel,
  trend,
  trendLabel,
  icon,
  color = 'cyan',
  className = '',
}) => {
  const colors = colorMap[color];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-6 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${colors.glow.replace('shadow-', '').replace('/20', '33')}`,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glow effect */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${colors.bg} blur-3xl opacity-50`}
      />

      <div className="relative z-10">
        {icon && (
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} ${colors.text} mb-4`}>
            {icon}
          </div>
        )}

        <div className={`text-4xl font-bold ${colors.text} mb-2`}>
          {value}
        </div>

        <div className="text-white/80 font-medium mb-1">
          {label}
        </div>

        {sublabel && (
          <div className="text-white/50 text-sm">
            {sublabel}
          </div>
        )}

        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-3 text-sm ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{trend >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}%</span>
            {trendLabel && <span className="text-white/40 ml-1">{trendLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;

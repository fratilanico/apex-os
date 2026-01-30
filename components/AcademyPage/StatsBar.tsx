import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Clock, Award, TrendingUp, Users } from 'lucide-react';

type ColorKey = 'cyan' | 'violet' | 'emerald' | 'yellow' | 'blue' | 'rose';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  color: ColorKey;
  description: string;
}

const useAnimatedCounter = (end: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [end, duration, delay]);

  return count;
};

export const StatsBar: React.FC = () => {
  const stats: StatItem[] = [
    { icon: BookOpen, value: 6, label: 'Modules', color: 'cyan', description: 'Comprehensive learning path' },
    { icon: FileText, value: 24, label: 'Sections', color: 'violet', description: 'Deep-dive lessons' },
    { icon: Clock, value: 20, suffix: '+', label: 'Hours', color: 'emerald', description: 'Of hands-on content' },
    { icon: Award, value: 12, label: 'AI Tools', color: 'yellow', description: 'Professional stack' },
    { icon: Users, value: 500, suffix: '+', label: 'Founders', color: 'blue', description: 'Building without tech co-founders' },
    { icon: TrendingUp, value: 100, suffix: 'x', label: 'ROI', color: 'rose', description: '$200/mo vs $200K/year' },
  ];

  const colorClasses: Record<ColorKey, {
    bg: string;
    border: string;
    text: string;
    glow: string;
    gradientFrom: string;
    gradientTo: string;
  }> = {
    cyan: { 
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-500/20', 
      text: 'text-cyan-400',
      glow: 'group-hover:shadow-cyan-500/50',
      gradientFrom: 'from-cyan-500/20',
      gradientTo: 'to-cyan-500/0'
    },
    violet: { 
      bg: 'bg-violet-500/10', 
      border: 'border-violet-500/20', 
      text: 'text-violet-400',
      glow: 'group-hover:shadow-violet-500/50',
      gradientFrom: 'from-violet-500/20',
      gradientTo: 'to-violet-500/0'
    },
    emerald: { 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20', 
      text: 'text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/50',
      gradientFrom: 'from-emerald-500/20',
      gradientTo: 'to-emerald-500/0'
    },
    yellow: { 
      bg: 'bg-yellow-500/10', 
      border: 'border-yellow-500/20', 
      text: 'text-yellow-400',
      glow: 'group-hover:shadow-yellow-500/50',
      gradientFrom: 'from-yellow-500/20',
      gradientTo: 'to-yellow-500/0'
    },
    blue: { 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20', 
      text: 'text-blue-400',
      glow: 'group-hover:shadow-blue-500/50',
      gradientFrom: 'from-blue-500/20',
      gradientTo: 'to-blue-500/0'
    },
    rose: { 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20', 
      text: 'text-rose-400',
      glow: 'group-hover:shadow-rose-500/50',
      gradientFrom: 'from-rose-500/20',
      gradientTo: 'to-rose-500/0'
    },
  };

  return (
    <div className="relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5 rounded-2xl blur-xl" />
      
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm p-6 sm:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colors = colorClasses[stat.color];
            const animatedValue = useAnimatedCounter(stat.value, 2000, idx * 100);
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative text-center"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradientFrom} ${colors.gradientTo} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg`} />
                
                <div className="relative">
                  {/* Icon container with enhanced effects */}
                  <motion.div 
                    className={`inline-flex w-12 h-12 sm:w-14 sm:h-14 rounded-xl items-center justify-center ${colors.bg} ${colors.border} border mb-3 transition-all duration-300 group-hover:scale-110 group-hover:border-opacity-50`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text} transition-all duration-300`} />
                  </motion.div>
                  
                  {/* Animated counter */}
                  <div className={`text-2xl sm:text-3xl font-bold ${colors.text} mb-1 tabular-nums`}>
                    {animatedValue}{stat.suffix || ''}
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs sm:text-sm text-white/60 font-medium mb-1">
                    {stat.label}
                  </div>
                  
                  {/* Description - visible on hover */}
                  <div className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom highlight bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="h-[2px] w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 mt-6 rounded-full"
        />
      </div>
    </div>
  );
};

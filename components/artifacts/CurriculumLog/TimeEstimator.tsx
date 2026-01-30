import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Target, Zap, TrendingUp } from 'lucide-react';
import { modules } from '../../../data/curriculumData';

interface TimeEstimatorProps {
  onClose?: () => void;
}

export const TimeEstimator: React.FC<TimeEstimatorProps> = ({ onClose }) => {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);

  // Calculate total curriculum hours
  const totalCurriculumHours = useMemo(() => {
    let total = 0;
    modules.forEach(module => {
      // Parse module duration
      const moduleDuration = module.duration.toLowerCase();
      if (moduleDuration.includes('min')) {
        const mins = parseInt(moduleDuration.match(/\d+/)?.[0] || '0');
        total += mins / 60;
      }
      
      // Parse section durations
      module.sections.forEach(section => {
        if (section.duration) {
          const sectionDuration = section.duration.toLowerCase();
          if (sectionDuration.includes('min')) {
            const mins = parseInt(sectionDuration.match(/\d+/)?.[0] || '0');
            total += mins / 60;
          }
        }
      });
    });
    return Math.ceil(total); // ~20 hours total
  }, []);

  // Calculate timeline based on hours per week
  const timeline = useMemo(() => {
    const totalWeeks = Math.ceil(totalCurriculumHours / hoursPerWeek);
    const today = new Date();
    const completionDate = new Date(today.getTime() + totalWeeks * 7 * 24 * 60 * 60 * 1000);
    
    // Calculate hours per module for breakdown
    const moduleBreakdown = modules.map(module => {
      let moduleHours = 0;
      
      // Module base duration
      const moduleDuration = module.duration.toLowerCase();
      if (moduleDuration.includes('min')) {
        const mins = parseInt(moduleDuration.match(/\d+/)?.[0] || '0');
        moduleHours += mins / 60;
      }
      
      // Section durations
      module.sections.forEach(section => {
        if (section.duration) {
          const sectionDuration = section.duration.toLowerCase();
          if (sectionDuration.includes('min')) {
            const mins = parseInt(sectionDuration.match(/\d+/)?.[0] || '0');
            moduleHours += mins / 60;
          }
        }
      });
      
      return {
        id: module.id,
        number: module.number,
        title: module.title,
        hours: Math.ceil(moduleHours * 10) / 10, // Round to 1 decimal
        weeksToComplete: Math.ceil(moduleHours / hoursPerWeek * 10) / 10,
      };
    });

    return {
      totalWeeks,
      completionDate,
      moduleBreakdown,
      dailyHours: (hoursPerWeek / 7).toFixed(1),
    };
  }, [hoursPerWeek, totalCurriculumHours]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getIntensityLevel = (hours: number) => {
    if (hours < 8) return { label: 'Relaxed', color: 'emerald', emoji: '🌱' };
    if (hours < 15) return { label: 'Steady', color: 'cyan', emoji: '⚡️' };
    if (hours < 25) return { label: 'Focused', color: 'violet', emoji: '🔥' };
    return { label: 'Intensive', color: 'rose', emoji: '🚀' };
  };

  const intensity = getIntensityLevel(hoursPerWeek);
  const progress = (hoursPerWeek - 5) / (40 - 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 items-center justify-center border border-cyan-500/30 flex-shrink-0">
            <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Time Estimator</h3>
            <p className="text-white/50 text-xs">Plan your learning journey</p>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <label className="text-white/70 text-sm font-medium block mb-1">
              Weekly Time Commitment
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {hoursPerWeek}
              </span>
              <span className="text-white/50 text-sm">hours/week</span>
            </div>
          </div>
          <div className="text-right min-w-0">
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <span className="text-xl">{intensity.emoji}</span>
              <span className="font-medium">{intensity.label} Pace</span>
            </div>
            <div className="text-white/40 text-xs mt-0.5">
              ~{timeline.dailyHours}h per day
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative pt-2 pb-1">
          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
            style={{
              background: `linear-gradient(to right, 
                rgb(34 211 238) 0%, 
                rgb(34 211 238) ${progress}%, 
                rgba(255,255,255,0.1) ${progress}%, 
                rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-white/30 mt-2">
            <span>5h</span>
            <span>20h</span>
            <span>40h</span>
          </div>
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div
          key={`weeks-${timeline.totalWeeks}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Duration
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400">
            {timeline.totalWeeks}
          </div>
          <div className="text-white/40 text-xs mt-1">
            {timeline.totalWeeks === 1 ? 'week' : 'weeks'} to complete
          </div>
        </motion.div>

        <motion.div
          key={`date-${timeline.completionDate.getTime()}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-lg p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Completion
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-violet-400 leading-tight break-words">
            {formatDate(timeline.completionDate)}
          </div>
          <div className="text-white/40 text-xs mt-1">
            Target finish date
          </div>
        </motion.div>
      </div>

      {/* Module Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <h4 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
            Your Roadmap
          </h4>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          <AnimatePresence mode="popLayout">
            {timeline.moduleBreakdown.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.02] border border-white/10 rounded-lg p-2 sm:p-3 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="text-cyan-500 font-mono text-xs font-bold shrink-0 mt-0.5">
                      {module.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/90 text-xs sm:text-sm font-medium group-hover:text-cyan-400 transition-colors truncate">
                        {module.title}
                      </div>
                      <div className="text-white/40 text-[10px] sm:text-xs mt-1 flex items-center gap-1 sm:gap-2 flex-wrap">
                        <span>{module.hours}h total</span>
                        <span className="text-white/20">•</span>
                        <span>{module.weeksToComplete} {module.weeksToComplete === 1 ? 'week' : 'weeks'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar preview */}
                  <div className="w-12 sm:w-16 shrink-0">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(module.hours / totalCurriculumHours) * 100}%` }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                      />
                    </div>
                    <div className="text-white/30 text-[10px] mt-1 text-right">
                      {Math.round((module.hours / totalCurriculumHours) * 100)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow relative overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        />
        <span className="relative flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 shrink-0" />
          <span className="truncate">
            Start My {timeline.totalWeeks}-Week Journey
          </span>
        </span>
      </motion.button>

      {/* Footer Stats */}
      <div className="pt-4 border-t border-white/10 text-center">
        <div className="text-white/30 text-xs">
          📊 <span className="text-white/50">Total curriculum: </span>
          <span className="text-cyan-400 font-mono">{totalCurriculumHours}h</span>
          <span className="text-white/30 mx-2">•</span>
          <span className="text-white/50">{modules.length} phases</span>
        </div>
      </div>
    </motion.div>
  );
};

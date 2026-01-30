import React from 'react';
import { Module } from '../../../types/curriculum';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { useCurriculumStore } from '../../../stores';

interface ModuleExpandedProps {
  module: Module;
  onSectionClick: (sectionId: string) => void;
}

export const ModuleExpanded: React.FC<ModuleExpandedProps> = ({ module, onSectionClick }) => {
  const { getModuleProgress, getSectionStatus } = useCurriculumStore();
  const progress = getModuleProgress(module.id);
  const completedSections = module.sections.filter(s => getSectionStatus(s.id) === 'completed').length;
  const isModuleCompleted = completedSections === module.sections.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Module Header */}
      <div className="border-l-2 border-cyan-500/40 pl-4 mb-4">
        <div className="text-white/50 text-xs uppercase tracking-widest mb-1">
          PHASE {module.number}
        </div>
        <div className="text-white font-bold text-lg mb-1">{module.title}</div>
        <div className="text-violet-400/80 text-sm mb-2">{module.subtitle}</div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/40">⏱ {module.duration} · {module.sections.length} sections</span>
          {isModuleCompleted && (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/[0.02] border border-white/10 rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-400 text-xs font-bold">MODULE PROGRESS</span>
          <span className="text-white/60 text-xs">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
          />
        </div>
        <div className="text-white/40 text-xs mt-2">
          {completedSections} of {module.sections.length} sections completed
        </div>
      </div>

      {/* Objective */}
      <div className="bg-white/[0.02] border border-white/10 rounded p-3 mb-4">
        <div className="text-emerald-400 text-xs font-bold mb-1.5">OBJECTIVE:</div>
        <div className="text-white/70 text-sm leading-relaxed">{module.objective}</div>
      </div>

      {/* Sections List with Progress */}
      <div className="space-y-1.5">
        <div className="text-cyan-400 text-xs font-bold tracking-wider mb-2">SECTIONS:</div>
        {module.sections.map((section, index) => {
          const status = getSectionStatus(section.id);
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in-progress';
          
          return (
            <motion.button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              whileHover={{ x: 4 }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded border transition-all group ${
                isCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' 
                  : isInProgress
                    ? 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40'
                    : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/30'
              }`}
            >
              <span className="shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : isInProgress ? (
                  <Play className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Circle className="w-4 h-4 text-white/30" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm transition-colors truncate ${
                  isCompleted ? 'text-emerald-400/80' : isInProgress ? 'text-cyan-400' : 'text-white/80 group-hover:text-cyan-400'
                }`}>
                  {section.title}
                </div>
                {section.duration && (
                  <div className="text-white/30 text-xs">{section.duration}</div>
                )}
              </div>
              <span className="text-white/20 group-hover:text-cyan-500/50 transition-colors text-xs">
                →
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Key Takeaways */}
      {module.keyTakeaways && module.keyTakeaways.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-emerald-400 text-xs font-bold tracking-wider mb-2">
            KEY TAKEAWAYS:
          </div>
          <ul className="space-y-1.5">
            {module.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="text-white/60 text-xs flex items-start gap-2">
                <span className="text-cyan-500/50 shrink-0">▸</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning Path Hint */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-white/30 text-xs flex items-start gap-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-500/50 shrink-0 mt-0.5" />
          <span>
            Click any section to start learning. Use <code className="text-cyan-400">next</code> and{' '}
            <code className="text-cyan-400">prev</code> to navigate between sections.
          </span>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Module } from '../../../types/curriculum';
import { tools } from '../../../data/curriculumData';

interface ModulePreviewCardProps {
  module: Module | null;
  position: { x: number; y: number };
}

export const ModulePreviewCard: React.FC<ModulePreviewCardProps> = ({ module, position }) => {
  if (!module) return null;

  // Calculate total estimated time from sections
  const calculateTotalTime = (): string => {
    let totalMinutes = 0;
    module.sections.forEach((section) => {
      if (section.duration) {
        const match = section.duration?.match(/(\d+)\s*min/);
        if (match?.[1]) {
          totalMinutes += parseInt(match[1], 10);
        }
      }
    });
    
    if (totalMinutes === 0) {
      return module.duration; // Fallback to module duration
    }
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    
    return `${totalMinutes} min`;
  };

  // Get first 4 sections
  const previewSections = module.sections.slice(0, 4);
  const hasMoreSections = module.sections.length > 4;

  // Get unique tools used across all sections
  const uniqueToolIds = Array.from(
    new Set(module.sections.flatMap((section) => section.tools))
  );
  const usedTools = tools.filter((tool) => uniqueToolIds.includes(tool.id));

  // Get key outcomes (takeaways)
  const keyOutcomes = module.keyTakeaways?.slice(0, 3) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -10 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
        }}
        className="pointer-events-none"
      >
        <div className="w-[380px] rounded-lg border border-cyan-500/30 shadow-2xl overflow-hidden">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl" />
          
          {/* Content */}
          <div className="relative p-5 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-cyan-400 text-xs font-mono font-bold tracking-wider mb-1">
                    PHASE {module.number}
                  </div>
                  <h3 className="text-white font-bold text-base leading-tight">
                    {module.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1">
                    {module.subtitle}
                  </p>
                </div>
                <div className="shrink-0 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs font-mono">
                  {calculateTotalTime()}
                </div>
              </div>

              {/* Objective */}
              <div className="bg-white/[0.03] border border-white/5 rounded p-2.5">
                <div className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Goal
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                  {module.objective}
                </p>
              </div>
            </div>

            {/* Section Preview */}
            <div>
              <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">
                Sections ({module.sections.length})
              </div>
              <div className="space-y-1.5">
                {previewSections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className="text-cyan-500/60 font-mono shrink-0 text-[10px] mt-0.5">
                      {section.id}
                    </span>
                    <span className="text-white/70 leading-tight flex-1">
                      {section.title}
                    </span>
                    {section.duration && (
                      <span className="text-white/30 text-[10px] shrink-0 font-mono">
                        {section.duration}
                      </span>
                    )}
                  </div>
                ))}
                {hasMoreSections && (
                  <div className="text-white/40 text-[10px] pl-2 pt-0.5">
                    + {module.sections.length - 4} more sections
                  </div>
                )}
              </div>
            </div>

            {/* Tools Used */}
            {usedTools.length > 0 && (
              <div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">
                  Tools Used
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {usedTools.slice(0, 6).map((tool) => (
                    <div
                      key={tool.id}
                      className="px-2 py-1 bg-cyan-500/5 border border-cyan-500/20 rounded text-cyan-400 text-[10px] font-medium"
                    >
                      {tool.name}
                    </div>
                  ))}
                  {usedTools.length > 6 && (
                    <div className="px-2 py-1 text-white/40 text-[10px]">
                      +{usedTools.length - 6}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Outcomes */}
            {keyOutcomes.length > 0 && (
              <div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">
                  After This You Can
                </div>
                <ul className="space-y-1.5">
                  {keyOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-emerald-500 shrink-0 text-[10px] mt-0.5">
                        ✓
                      </span>
                      <span className="text-white/70 leading-tight">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom hint */}
            <div className="pt-2 border-t border-white/5">
              <div className="text-white/30 text-[10px] flex items-center gap-1.5">
                <span>→</span>
                <span>Click to explore full module</span>
              </div>
            </div>
          </div>

          {/* Accent border glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-50 blur-sm pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

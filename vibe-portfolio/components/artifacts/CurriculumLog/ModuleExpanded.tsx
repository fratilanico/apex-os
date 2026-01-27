import React from 'react';
import { Module } from '../../../types/curriculum';
import { motion } from 'framer-motion';

interface ModuleExpandedProps {
  module: Module;
  onSectionClick: (sectionId: string) => void;
}

export const ModuleExpanded: React.FC<ModuleExpandedProps> = ({ module, onSectionClick }) => {
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
        <div className="text-white/40 text-xs">
          ⏱ {module.duration} · {module.sections.length} sections
        </div>
      </div>

      {/* Objective */}
      <div className="bg-white/[0.02] border border-white/10 rounded p-3 mb-4">
        <div className="text-emerald-400 text-xs font-bold mb-1.5">OBJECTIVE:</div>
        <div className="text-white/70 text-sm leading-relaxed">{module.objective}</div>
      </div>

      {/* Sections List */}
      <div className="space-y-1.5">
        <div className="text-cyan-400 text-xs font-bold tracking-wider mb-2">SECTIONS:</div>
        {module.sections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            whileHover={{ x: 4 }}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-cyan-500/30 transition-all group"
          >
            <span className="text-cyan-500/50 text-xs font-mono shrink-0">
              {section.id}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-white/80 text-sm group-hover:text-cyan-400 transition-colors truncate">
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
        ))}
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
    </motion.div>
  );
};

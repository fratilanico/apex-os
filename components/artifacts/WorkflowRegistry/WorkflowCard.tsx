import React from 'react';
import { motion } from 'framer-motion';
import { Workflow } from '../../../types/workflow';
import { Shield, Zap, Terminal, Activity } from 'lucide-react';

interface WorkflowCardProps {
  workflow: Workflow;
  isMastered: boolean;
  isBookmarked: boolean;
  onClick: () => void;
  onToggleBookmark: (e: React.MouseEvent) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  isMastered,
  isBookmarked,
  onClick,
  onToggleBookmark
}) => {
  const categoryIcons: Record<string, any> = {
    MEDIA_ANALYSIS: Activity,
    BROWSER_AUTOMATION: Terminal,
    VOICE_NLP: Zap,
    MULTI_AGENT: Shield,
    API_INTEGRATION: Zap,
    DEVELOPMENT: Terminal,
    STANDARDS: Shield,
  };

  const Icon = categoryIcons[workflow.category] || Terminal;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-xl border border-white/5 cursor-pointer overflow-hidden group
        ${isMastered ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/10'}`}
    >
      {/* Background Glow */}
      <div className={`absolute -inset-1 opacity-0 group-hover:opacity-10 transition-opacity blur-xl
        ${isMastered ? 'bg-emerald-500' : 'bg-cyan-500'}`} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className={`p-2 rounded-lg ${isMastered ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <button
          onClick={onToggleBookmark}
          className={`text-xs uppercase tracking-widest font-bold transition-colors
            ${isBookmarked ? 'text-yellow-400' : 'text-white/20 hover:text-white/40'}`}
        >
          {isBookmarked ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
          {workflow.name}
        </h3>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
          {workflow.category.replace('_', ' ')}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${workflow.confidence === 'high' ? 'bg-emerald-500' : workflow.confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
          <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">
            {workflow.confidence} CONF
          </span>
        </div>
        
        {isMastered && (
          <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">
            Mastered
          </span>
        )}
      </div>
    </motion.div>
  );
};

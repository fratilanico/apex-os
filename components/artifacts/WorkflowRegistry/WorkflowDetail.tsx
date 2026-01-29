import React from 'react';
import { motion } from 'framer-motion';
import { Workflow } from '../../../types/workflow';
import { X, CheckCircle2, Award } from 'lucide-react';

interface WorkflowDetailProps {
  workflow: Workflow;
  isMastered: boolean;
  onClose: () => void;
  onMarkMastered: () => void;
}

export const WorkflowDetail: React.FC<WorkflowDetailProps> = ({
  workflow,
  isMastered,
  onClose,
  onMarkMastered
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-zinc-950 border-l border-white/5 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-zinc-900/30 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
              {workflow.category}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10`}>
              <div className={`w-1 h-1 rounded-full ${workflow.confidence === 'high' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
              <span className="text-[9px] text-white/40 uppercase font-bold">{workflow.confidence} Confidence</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{workflow.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8 no-scrollbar">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Description</h3>
          <p className="text-sm text-white/70 leading-relaxed font-medium">
            {workflow.description}
          </p>
        </section>

        {workflow.triggerPhrases.length > 0 && (
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Trigger Phrases</h3>
            <div className="grid grid-cols-1 gap-2">
              {workflow.triggerPhrases.map((phrase, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/5 text-xs text-cyan-400 font-mono italic">
                  "{phrase}"
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Prerequisites</h3>
          <div className="space-y-2">
            {workflow.prerequisites.map((pre, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-white/60">
                <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white/20" />
                </div>
                <span>{pre.name} <span className="text-[10px] text-white/20 uppercase tracking-widest ml-1">({pre.type})</span></span>
              </div>
            ))}
          </div>
        </section>

        {workflow.codePatterns.length > 0 && (
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Code Patterns</h3>
            <div className="space-y-4">
              {workflow.codePatterns.map((pattern, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[11px] text-emerald-400/80 font-bold">// {pattern.description}</p>
                  <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[11px] text-white/80 overflow-x-auto">
                    <pre><code>{pattern.code}</code></pre>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-white/5 bg-zinc-900/30">
        {!isMastered ? (
          <button
            onClick={onMarkMastered}
            className="w-full py-4 rounded-xl bg-cyan-500 text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Award className="w-4 h-4" />
            Mark as Mastered (+{workflow.xpReward} XP)
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Workflow Mastered
          </div>
        )}
      </div>
    </motion.div>
  );
};

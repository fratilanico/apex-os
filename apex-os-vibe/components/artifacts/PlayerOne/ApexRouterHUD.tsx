'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { routeTask, type TaskRequirements, type RouterDecision } from '@/lib/apexRouter';
import { Zap, Shield, Bug, Box, ChevronRight, Activity, Globe, Send } from 'lucide-react';

interface ParsedTask {
  type: TaskRequirements['type'];
  contextSize: number;
  priority: TaskRequirements['priority'];
  description: string;
}

const parseTaskInput = (input: string): ParsedTask => {
  const lower = input.toLowerCase();
  
  // Determine task type based on keywords
  let type: TaskRequirements['type'] = 'CODING';
  if (/\b(debug|fix|bug|error|crash)\b/.test(lower)) {
    type = 'DEBUGGING';
  } else if (/\b(plan|design|architect|refactor|system)\b/.test(lower)) {
    type = 'PLANNING';
  } else if (/\b(research|analyze|investigate|learn)\b/.test(lower)) {
    type = 'ANALYSIS';
  }
  
  // Determine priority based on keywords
  let priority: TaskRequirements['priority'] = 'VELOCITY';
  if (/\b(safe|stable|reliable|production)\b/.test(lower)) {
    priority = 'STABILITY';
  } else if (/\b(cheap|budget|minimal|efficient)\b/.test(lower)) {
    priority = 'COST';
  }
  
  // Estimate context size based on complexity words
  let contextSize = 10000;
  if (/\b(large|complex|entire|full)\b/.test(lower)) {
    contextSize = 500000;
  } else if (/\b(medium|module|feature)\b/.test(lower)) {
    contextSize = 50000;
  }
  
  return {
    type,
    contextSize,
    priority,
    description: input.trim(),
  };
};

export const ApexRouterHUD: React.FC = () => {
  const [lastDecision, setLastDecision] = useState<RouterDecision | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);

  const simulateRouting = async (type: TaskRequirements['type'], context: number, priority: TaskRequirements['priority'], description?: string) => {
    setIsRouting(true);
    // Artificial latency for "thinking"
    await new Promise(r => setTimeout(r, 1200));
    
    const decision = routeTask({ type, contextSize: context, priority });
    setLastDecision(decision);
    setIsRouting(false);
    
    // Clear parsed task if it was from preset buttons
    if (!description) {
      setParsedTask(null);
    }
  };

  const handleCustomSubmit = async () => {
    if (!customInput.trim() || isRouting) return;
    
    const parsed = parseTaskInput(customInput);
    setParsedTask(parsed);
    setCustomInput('');
    
    await simulateRouting(parsed.type, parsed.contextSize, parsed.priority, parsed.description);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleCustomSubmit();
    }
  };

  const tasks: Array<{ label: string; type: TaskRequirements['type']; ctx: number; prio: TaskRequirements['priority']; icon: React.ComponentType<{ className?: string }> }> = [
    { label: 'System Refactor', type: 'PLANNING', ctx: 850000, prio: 'STABILITY', icon: Shield },
    { label: 'Build API Bridge', type: 'CODING', ctx: 15000, prio: 'VELOCITY', icon: Zap },
    { label: 'Fix Race Condition', type: 'DEBUGGING', ctx: 45000, prio: 'STABILITY', icon: Bug },
    { label: 'Static Site Gen', type: 'CODING', ctx: 2500, prio: 'COST', icon: Box },
  ];

  return (
    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cognitive Router v1.0</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {tasks.map((task) => {
          const IconComponent = task.icon;
          return (
            <button
              key={task.label}
              onClick={() => {
                setParsedTask(null);
                simulateRouting(task.type, task.ctx, task.prio);
              }}
              disabled={isRouting}
              className="flex flex-col items-start p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group disabled:opacity-50"
            >
              <IconComponent className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-400 mb-2 transition-colors" />
              <span className="text-[10px] font-bold text-white/80 uppercase">{task.label}</span>
              <span className="text-[8px] text-white/20 font-mono mt-1">{task.ctx.toLocaleString()} TOKENS</span>
            </button>
          );
        })}
      </div>

      {/* Custom Task Input */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCustomSubmit();
        }}
        className="flex gap-2 mb-8"
      >
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRouting}
          placeholder="Describe a task to route..."
          className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all disabled:opacity-50"
          enterKeyHint="send"
        />
        <button
          type="submit"
          disabled={isRouting || !customInput.trim()}
          className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          title="Route task"
        >
          <Send className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        </button>
      </form>

      <div className="min-h-[160px] relative">
        <AnimatePresence mode="wait">
          {isRouting ? (
            <motion.div
              key="routing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                    className="w-1.5 bg-cyan-500 rounded-full"
                  />
                ))}
              </div>
              <p className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase tracking-[0.2em]">Analyzing Request Path...</p>
            </motion.div>
          ) : lastDecision ? (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Show parsed task info if custom input was used */}
              {parsedTask && (
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">Parsed Input</p>
                  <p className="text-[11px] text-white/80 truncate mb-2">&quot;{parsedTask.description}&quot;</p>
                  <div className="flex gap-2 text-[8px] font-mono">
                    <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">{parsedTask.type}</span>
                    <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">{parsedTask.priority}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">{parsedTask.contextSize.toLocaleString()} TOKENS</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-cyan-500/30">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-cyan-400 uppercase">Routed To</p>
                    <p className="text-sm font-black text-white uppercase">{lastDecision.modelId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/40 uppercase">Effort</p>
                  <p className={`text-xs font-black uppercase ${lastDecision.effort === 'HIGH' ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {lastDecision.effort}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] font-mono text-white/60 leading-relaxed italic">
                    &quot;{lastDecision.reason}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-[10px] font-mono text-white/10 uppercase tracking-widest">Awaiting Task Assignment</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

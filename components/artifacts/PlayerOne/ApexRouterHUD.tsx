'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { routeTask, getAgentInfo, type RoutingDecision } from '@/lib/agents/router';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import type { TaskType } from '@/lib/agents/types';
import { Zap, Shield, Bug, ChevronRight, Activity, Globe, Send, BarChart3 } from 'lucide-react';

interface ParsedTask {
  type: TaskType;
  query: string;
}

const parseTaskInput = (input: string): ParsedTask => {
  const lower = input.toLowerCase();
  let type: TaskType = 'code-generation';
  
  if (/\b(debug|fix|bug|error|crash)\b/.test(lower)) {
    type = 'debugging';
  } else if (/\b(plan|design|architect|refactor|system|strategy)\b/.test(lower)) {
    type = 'strategy';
  } else if (/\b(research|analyze|investigate|learn|find|search)\b/.test(lower)) {
    type = 'search';
  } else if (/\b(recall|remember|knowledge)\b/.test(lower)) {
    type = 'knowledge-recall';
  }
  
  return {
    type,
    query: input.trim(),
  };
};

export const ApexRouterHUD: React.FC = () => {
  const [lastDecision, setLastDecision] = useState<RoutingDecision | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  
  const { rlmStats } = useKnowledgeStore();

  const simulateRouting = async (query: string, taskType?: TaskType) => {
    setIsRouting(true);
    // Artificial latency for "thinking"
    await new Promise(r => setTimeout(r, 800));
    
    // Use real RLM scores if available
    const pastSuccessData = rlmStats?.agentScores;
    
    const decision = routeTask({ 
      query, 
      taskType,
      pastSuccessData 
    });
    
    setLastDecision(decision);
    setIsRouting(false);
  };

  const handleCustomSubmit = async () => {
    if (!customInput.trim() || isRouting) return;
    
    const parsed = parseTaskInput(customInput);
    setParsedTask(parsed);
    setCustomInput('');
    
    await simulateRouting(parsed.query, parsed.type);
  };

  const tasks: Array<{ label: string; type: TaskType; icon: React.ComponentType<{ className?: string }> }> = [
    { label: 'System Strategy', type: 'strategy', icon: Shield },
    { label: 'Build Feature', type: 'code-generation', icon: Zap },
    { label: 'Debug Crash', type: 'debugging', icon: Bug },
    { label: 'Search Trends', type: 'search', icon: Globe },
  ];

  const selectedAgent = lastDecision ? getAgentInfo(lastDecision.agentId) : null;

  return (
    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cognitive Router v1.1</h3>
        </div>
        {rlmStats && (
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            <BarChart3 className="w-3 h-3 text-emerald-400" />
            <span className="text-[8px] font-black text-emerald-400 uppercase">RLM_SYNCED</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {tasks.map((task) => {
          const IconComponent = task.icon;
          return (
            <button
              key={task.label}
              onClick={() => {
                setParsedTask({ type: task.type, query: task.label });
                simulateRouting(task.label, task.type);
              }}
              disabled={isRouting}
              className="flex flex-col items-start p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group disabled:opacity-50"
            >
              <IconComponent className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-400 mb-2 transition-colors" />
              <span className="text-[10px] font-bold text-white/80 uppercase">{task.label}</span>
              <span className="text-[8px] text-white/20 font-mono mt-1">{task.type.replace('-', '_').toUpperCase()}</span>
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
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          id="router-task"
          name="routerTask"
          aria-label="Task to route"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          disabled={isRouting}
          placeholder="Describe a task to route..."
          className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isRouting || !customInput.trim()}
          className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Send className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        </button>
      </form>

      <div className="flex-1 relative">
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
              <p className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase tracking-[0.2em]">Analyzing RLM Vectors...</p>
            </motion.div>
          ) : lastDecision && selectedAgent ? (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Show parsed task info if custom input was used */}
              {parsedTask && (
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[9px] font-mono text-white/40 mb-1 uppercase tracking-wider">Active Task</p>
                  <p className="text-[11px] text-white/80 truncate mb-2">&quot;{parsedTask.query}&quot;</p>
                  <div className="flex gap-2 text-[8px] font-mono">
                    <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded uppercase">{parsedTask.type}</span>
                  </div>
                </div>
              )}

              <div className={`flex items-center justify-between p-3 bg-${selectedAgent.color}-500/10 border border-${selectedAgent.color}-500/20 rounded-xl`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-${selectedAgent.color}-500/30`}>
                    <Globe className={`w-5 h-5 text-${selectedAgent.color}-400`} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold text-${selectedAgent.color}-400 uppercase tracking-tighter`}>Routed to Agent</p>
                    <p className="text-sm font-black text-white uppercase">{selectedAgent.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/40 uppercase">Confidence</p>
                  <p className="text-xs font-black text-white uppercase">
                    {Math.round(lastDecision.confidence * 100)}%
                  </p>
                </div>
              </div>

              {/* RLM Agent Stats */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(rlmStats?.agentScores || { sovereign: 0.85, architect: 0.92, builder: 0.78, scout: 0.95 }).map(([agentId, score]) => {
                  const info = getAgentInfo(agentId as any);
                  return (
                    <div key={agentId} className="px-2 py-1.5 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[8px] font-bold uppercase text-white/40">
                        <span>{info.name}</span>
                        <span className={`text-${info.color}-400`}>{Math.round(score * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-${info.color}-500 opacity-50`} style={{ width: `${score * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] font-mono text-white/60 leading-relaxed italic">
                    &quot;{lastDecision.reasoning}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-[10px] font-mono text-white/10 uppercase tracking-widest text-center px-4">
                Awaiting Task Assignment<br/>
                <span className="text-[8px] opacity-50">Cross-Referencing Frontier Models</span>
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

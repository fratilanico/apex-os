import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWorkflowStore } from '../../../stores/useWorkflowStore';
import { useSkillTreeStore } from '../../../stores/useSkillTreeStore';
import { WorkflowCard } from './WorkflowCard';
import { WorkflowDetail } from './WorkflowDetail';
import { WorkflowCategory } from '../../../types/workflow';
import { Search } from 'lucide-react';

export const WorkflowRegistry: React.FC = () => {
  const { workflows, progress, bookmarks, toggleBookmark, markMastered } = useWorkflowStore();
  const { setCurrentXP, currentXP, addDMLog } = useSkillTreeStore();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<WorkflowCategory | 'ALL'>('ALL');

  const categories: (WorkflowCategory | 'ALL')[] = [
    'ALL',
    'MEDIA_ANALYSIS',
    'BROWSER_AUTOMATION',
    'VOICE_NLP',
    'MULTI_AGENT',
    'API_INTEGRATION',
    'DEVELOPMENT',
    'STANDARDS'
  ];

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'ALL' || w.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [workflows, searchQuery, activeCategory]);

  const selectedWorkflow = useMemo(() => 
    workflows.find(w => w.id === selectedId),
    [workflows, selectedId]
  );

  const handleMarkMastered = (id: string, xp: number) => {
    markMastered(id);
    setCurrentXP(currentXP + xp);
    addDMLog(`WORKFLOW MASTERED: ${id} (+${xp} XP)`);
  };

  return (
    <div className="flex h-full bg-zinc-950/50 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="p-6 border-b border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Workflow Registry</h1>
              <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold mt-1">
                {workflows.length} Documented Procedures
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                {Object.values(progress).filter(p => p.mastered).length} Mastered
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all
                    ${activeCategory === cat 
                      ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                      : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  isMastered={progress[workflow.id]?.mastered || false}
                  isBookmarked={bookmarks.includes(workflow.id)}
                  onClick={() => setSelectedId(workflow.id)}
                  onToggleBookmark={(e) => {
                    e.stopPropagation();
                    toggleBookmark(workflow.id);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredWorkflows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white/10" />
              </div>
              <h3 className="text-white/40 font-bold uppercase tracking-widest text-xs">No workflows match your search</h3>
            </div>
          )}
        </div>
      </div>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedWorkflow && (
          <div className="w-full lg:w-[400px] xl:w-[500px]">
            <WorkflowDetail
              workflow={selectedWorkflow}
              isMastered={progress[selectedWorkflow.id]?.mastered || false}
              onClose={() => setSelectedId(null)}
              onMarkMastered={() => handleMarkMastered(selectedWorkflow.id, selectedWorkflow.xpReward)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

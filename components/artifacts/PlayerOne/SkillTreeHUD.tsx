'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { tools } from '@/data/curriculumData';
import { useCurriculumStore } from '@/stores/useCurriculumStore';
import { useAcademyStore } from '@/stores/useAcademyStore';
import { useWorkflowStore } from '@/stores/useWorkflowStore';
import { Zap, Code2, Bot, Sparkles, Cloud, Rocket, Workflow, BookOpen, Palette, Bug, Terminal, Image, Video, ShieldCheck, Trophy, Target, ChevronRight, Award } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Code2, Bot, Sparkles, Cloud, Rocket, Workflow, BookOpen, Palette, Bug, Terminal, Image, Video, ShieldCheck, Trophy, Target
};

// Group tools by tier for display
const coreTools = tools.filter(t => t.tier === 'core');
const assetTools = tools.filter(t => t.tier === 'asset');

export const SkillTreeHUD: React.FC = () => {
  const { unlockedSkills, currentXP, gold } = useSkillTreeStore();
  const { modules, loadModules } = useCurriculumStore();
  const { setNavigationView, setView, selectModule } = useAcademyStore();
  const { workflows, progress } = useWorkflowStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    loadModules().catch(() => undefined);
  }, [loadModules]);

  return (
    <div className="relative w-full h-auto min-h-[400px] md:h-[600px] overflow-hidden bg-zinc-950/80 rounded-2xl border border-white/5 backdrop-blur-xl flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-start p-6 pb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Skill Tree: The OASIS
          </h2>
          <p className="text-white/40 text-xs font-mono mt-1 uppercase tracking-widest">
            Level 2 Arch-Architect // {currentXP} XP
          </p>
        </div>
        <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
          <span className="text-yellow-400 font-bold font-mono">{gold}</span>
          <span className="text-yellow-500/60 text-[10px] font-bold uppercase">Gold</span>
        </div>
      </div>

      {/* Scrollable Content - Only scroll internally on desktop, let parent handle mobile */}
      <div className="relative flex-1 overflow-y-visible md:overflow-y-auto no-scrollbar px-6 pb-16">
        
        {/* MODULES SECTION - Vertical list */}
        <div className="mb-8">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BookOpen className="w-3 h-3" /> Curriculum Modules
          </h3>
          <div className="space-y-3">
            {modules.map((module, idx) => {
              const isUnlocked = unlockedSkills.includes(module.id);
              const Icon = iconMap[module.icon] || Code2;
              const objectivePreview = module.objective.length > 90
                ? `${module.objective.slice(0, 87)}...`
                : module.objective;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`
                    relative flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer
                    ${isUnlocked 
                      ? 'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}
                  `}
                  onClick={() => {
                    selectModule(module.id);
                    setNavigationView('module');
                    setView('grid');
                    navigate('/academy');
                  }}
                >
                  {/* Module Number */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-bold flex-shrink-0
                    ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/20'}
                  `}>
                    {module.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isUnlocked ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-white/20'}
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                      {module.title}
                    </p>
                    <p className="text-[10px] text-white/30 truncate">{module.subtitle}</p>
                    <p className="text-[10px] text-white/40 truncate">
                      {module.duration} • {module.sections.length} sections
                    </p>
                    <p className="text-[9px] text-white/20 truncate">
                      {objectivePreview}
                    </p>
                  </div>
                  
                  {/* Status */}
                  {isUnlocked ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* WORKFLOW MASTERY SECTION */}
        <div className="mb-8">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-3 h-3" /> Workflow Mastery
            </div>
            <span className="text-cyan-400/60 font-mono">
              {Object.values(progress).filter(p => p.mastered).length}/{workflows.length}
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workflows.slice(0, 4).map((wf, idx) => {
              const isMastered = progress[wf.id]?.mastered;
              return (
                <motion.div
                  key={wf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3
                    ${isMastered ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isMastered ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
                    <span className={`text-xs font-medium truncate ${isMastered ? 'text-white' : 'text-white/40'}`}>{wf.name}</span>
                  </div>
                  {isMastered && <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                </motion.div>
              );
            })}
            <button 
              onClick={() => {
                setView('registry' as any); // Custom view or handled by AcademyStore
                navigate('/academy');
              }}
              className="col-span-full py-2 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] text-white/30 uppercase tracking-widest font-black hover:bg-white/5 hover:text-white transition-all"
            >
              Access Workflow Registry →
            </button>
          </div>
        </div>

        {/* CORE TOOLS SECTION - Grid */}
        <div className="mb-8">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-3 h-3" /> Core Stack (Tier 1)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {coreTools.map((tool, idx) => {
              const isUnlocked = unlockedSkills.includes(tool.id);
              const Icon = iconMap[tool.icon] || Code2;
              
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`
                    relative p-3 rounded-xl border transition-all cursor-pointer group
                    ${isUnlocked 
                      ? 'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/20'}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isUnlocked && (
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                  <p className={`text-xs font-semibold truncate ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                    {tool.name}
                  </p>
                  <p className={`text-[9px] uppercase tracking-wider ${isUnlocked ? 'text-cyan-400/60' : 'text-white/20'}`}>
                    {tool.category}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ASSET TOOLS SECTION - Grid */}
        <div className="mb-8">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Asset Layer (Tier 2)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {assetTools.map((tool, idx) => {
              const isUnlocked = unlockedSkills.includes(tool.id);
              const Icon = iconMap[tool.icon] || Code2;
              
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`
                    relative p-3 rounded-xl border transition-all cursor-pointer group
                    ${isUnlocked 
                      ? 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isUnlocked ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/20'}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isUnlocked && (
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                  <p className={`text-xs font-semibold truncate ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                    {tool.name}
                  </p>
                  <p className={`text-[9px] uppercase tracking-wider ${isUnlocked ? 'text-purple-400/60' : 'text-white/20'}`}>
                    {tool.category}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex justify-center pointer-events-none">
        <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.15em] flex items-center gap-2">
          <Trophy className="w-3 h-3" />
          Earn XP to unlock nodes // Complete quests to earn Gold
        </p>
      </div>
    </div>
  );
};

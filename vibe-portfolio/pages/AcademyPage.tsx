import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Box, 
  FileCode, 
  GitBranch, 
  Layers, 
  Award,
  ArrowRight,
  CheckCircle2,
  Wrench,
  GraduationCap,
  Terminal,
} from 'lucide-react';
import { BentoCard, StatsBar, ViewToggle } from '../components/AcademyPage';
import { ToolArsenal } from '../components/artifacts/ToolArsenal/ToolArsenal';
import { CurriculumLog } from '../components/artifacts/CurriculumLog/CurriculumLog';
import { AuthenticatedTerminal } from '../components/artifacts/AuthenticatedTerminal';
import { modules } from '../data/curriculumData';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useAuthStore } from '../stores';
import { useAcademyStore } from '../stores';

export const AcademyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();
  const { displayMode, setView } = useAcademyStore();
  const [showAuthTerminal, setShowAuthTerminal] = useState(false);

  const iconMap = {
    Zap,
    Box,
    FileCode,
    GitBranch,
    Layers,
    Award,
  };

  const modulesWithIcons = modules.map(module => ({
    ...module,
    iconComponent: iconMap[module.icon as keyof typeof iconMap] || Box,
  }));

  const handleModuleClick = (moduleId: string) => {
    navigate(`/#${moduleId}`);
  };

  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-5xl mx-auto pb-16">
      {/* Enhanced Hero Section with Floating Particles */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 pb-12">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Social proof badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 mb-6"
        >
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 border-2 border-black" />
            ))}
          </div>
          <span className="text-sm font-medium text-cyan-400">
            Join 500+ founders building without tech co-founders
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-4 tracking-wide"
        >
          MASTER AI ORCHESTRATION IN 6 MODULES
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">The Complete</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
            AI Engineering Curriculum
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          From autocomplete mindset to orchestrator mastery.
          <br />
          <span className="text-white/80 font-semibold">Ship production features in days, not months.</span>
        </motion.p>

        {/* Value proposition cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto"
        >
          {[
            { label: 'Investment', value: '$200/month', color: 'from-cyan-500 to-cyan-600' },
            { label: 'vs Tech Co-Founder', value: '$200K/year', color: 'from-violet-500 to-violet-600' },
            { label: 'Time to Ship', value: 'Start Today', color: 'from-emerald-500 to-emerald-600' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 rounded-xl blur-lg transition-opacity`} />
              <div className="relative p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <div className="text-xs text-white/40 mb-1 font-mono uppercase">{item.label}</div>
                <div className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${item.color}`}>
                  {item.value}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 text-sm"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium">20+ hours of content</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400 font-medium">Lifetime access</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Certificate included</span>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Stats Bar */}
      <section className="pb-12">
        <StatsBar />
      </section>

      {/* Modules Section with View Toggle */}
      <section className="pb-12" data-curriculum-section>
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Section badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 mb-4"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">COMPLETE LEARNING PATH</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            <span className="text-white">Explore the </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              Curriculum
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base text-white/60 mb-6 leading-relaxed"
          >
            {isAuthenticated 
              ? 'Choose your view: visual grid or interactive terminal. Both designed for rapid mastery.' 
              : 'Explore the visual grid below, or authenticate to access the interactive terminal experience.'}
          </motion.p>
          
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ViewToggle activeView={displayMode} onViewChange={setView} />
            </motion.div>
          )}
        </div>

        {/* Grid View - Use CSS hiding instead of unmount to prevent re-renders (flickering fix) */}
        <div className={displayMode !== 'grid' ? 'hidden' : ''}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulesWithIcons.map((module) => (
              <BentoCard
                key={module.id}
                number={module.number}
                title={module.title}
                subtitle={module.subtitle}
                duration={module.duration}
                objective={module.objective}
                icon={module.iconComponent}
                sectionCount={module.sections.length}
                onClick={() => handleModuleClick(module.id)}
              />
            ))}
          </div>
        </div>

        {/* Terminal View - Keep mounted to preserve state (flickering fix) */}
        {isAuthenticated && (
          <div className={displayMode !== 'terminal' ? 'hidden' : ''}>
            <ErrorBoundary>
              <CurriculumLog />
            </ErrorBoundary>
          </div>
        )}

        {/* Locked State - Show when not authenticated and terminal view selected */}
        {!isAuthenticated && displayMode === 'terminal' && (
          <div className="text-center py-16 border border-white/10 rounded-xl bg-white/[0.02]">
            <Terminal className="w-16 h-16 mx-auto mb-4 text-cyan-400/30" />
            <p className="text-white/50 mb-6">Terminal access requires authentication.</p>
            <button
              onClick={() => setShowAuthTerminal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 font-medium transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span>Access Terminal</span>
            </button>
          </div>
        )}
      </section>

      {/* Auth Terminal Modal - No outer AnimatePresence to prevent double-animation conflict */}
      {showAuthTerminal && !isAuthenticated && (
        <ErrorBoundary>
          <AuthenticatedTerminal
            key="auth-terminal"
            onAuthenticated={(user) => {
              // Close terminal FIRST to prevent scroll conflicts
              setShowAuthTerminal(false);
              
              // Use requestAnimationFrame to batch state updates after render
              requestAnimationFrame(() => {
                // Convert AuthUser to store's AuthUser format (ensure name is defined)
                login({
                  email: user.email,
                  name: user.name || 'User',
                  authMethod: 'cli', // Enforce CLI OAuth
                });
                setView('terminal');  // Zustand action
                
                // Scroll to curriculum section smoothly after a brief delay
                setTimeout(() => {
                  const curriculumSection = document.querySelector('[data-curriculum-section]');
                  if (curriculumSection) {
                    curriculumSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300);
              });
            }}
            onClose={() => setShowAuthTerminal(false)}
          />
        </ErrorBoundary>
      )}

      {/* Tools Section */}
      <section className="pb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Your C-Suite of AI Tools
          </h2>
          <p className="text-sm text-white/50">
            Each tool serves a founder-focused role in your technical team.
          </p>
        </div>
        <ErrorBoundary>
          <ToolArsenal />
        </ErrorBoundary>
      </section>

      {/* What You'll Master - Compact horizontal cards */}
      <section className="pb-12">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            What You'll Master
          </h2>
          <p className="text-sm text-white/50">
            By the end, you'll orchestrate AI agents like a senior engineer manages a team.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Wrench, title: 'Hands-On Projects', desc: 'Build real features with multi-agent orchestration' },
            { icon: Zap, title: 'Tool Mastery', desc: 'Master all 12 tools in the modern AI stack' },
            { icon: GraduationCap, title: 'Certification', desc: 'Earn certification with solo practicum project' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg border border-white/10 bg-white/[0.02] text-center"
            >
              <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 items-center justify-center mx-auto mb-3 flex-shrink-0">
                <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-white/50">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Principles - Compact */}
      <section className="pb-12">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Core Principles You'll Learn</h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              'AI orchestration beats AI assistance',
              'Context windows enable repository-aware reasoning',
              'Specialization beats generalization',
              'Cost-quality-speed triangle requires optimization',
              'Configuration files prevent prompt fatigue',
              'Multi-agent systems scale, chatbots don\'t',
              'Verification gates ensure quality',
              'Parallel execution saves hours',
            ].map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Founder Focused */}
      <section className="text-center py-10 border-t border-white/5">
        <h2 className="text-xl font-bold text-white mb-2">
          Ready to Build Your AI Engineering Team?
        </h2>
        <p className="text-sm text-white/50 mb-6">
          Stop hunting for a technical co-founder. Start deploying specialized agents that work 24/7 for $200/month instead of $200K/year.
        </p>
        {!isAuthenticated ? (
          <button
            onClick={() => setShowAuthTerminal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span>Access Terminal</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => {
                setView('terminal');  // Zustand action
                const curriculumSection = document.querySelector('[data-curriculum-section]');
                if (curriculumSection) {
                  curriculumSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <span>Explore Terminal View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

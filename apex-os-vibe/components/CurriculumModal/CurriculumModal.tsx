import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, ArrowRight, Menu, ChevronLeft } from 'lucide-react';
import { curriculumData } from '../../data/curriculumData';
import { useHashRouter } from '../../hooks/useHashRouter';
import { ModuleSidebar } from './ModuleSidebar';
import { ModuleContent } from './ModuleContent';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Terminal-style modal overlay for the curriculum
 * Shows landing page by default, navigates to modules via hash routing
 */
export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentHash, navigateTo, clearHash } = useHashRouter();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Sync with hash changes
  useEffect(() => {
    if (currentHash.startsWith('module-')) {
      setActiveModuleId(currentHash);
      setActiveSectionId(undefined); // Reset section when module changes
    } else {
      setActiveModuleId(null);
      setActiveSectionId(undefined);
    }
  }, [currentHash]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    clearHash();
    onClose();
  };

  const handleNavigate = (moduleId: string, sectionId?: string) => {
    navigateTo(moduleId);
    setActiveModuleId(moduleId);
    setActiveSectionId(sectionId);

    // Scroll to section if specified
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const activeModule = activeModuleId
    ? curriculumData.modules.find((m) => m.id === activeModuleId)
    : null;

  // Don't render if not open - avoids AnimatePresence issues
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="curriculum-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        key="curriculum-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
            <div
              className="w-full max-w-7xl h-[85vh] bg-black border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Mobile sidebar toggle */}
                  {activeModule && (
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                      aria-label={sidebarOpen ? 'Hide menu' : 'Show menu'}
                    >
                      {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                  )}
                  <BookOpen className="w-5 h-5 text-cyan-400 flex-shrink-0 hidden sm:block" />
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono truncate">
                    Vibe Coder Academy
                  </h2>
                  {activeModule && (
                    <>
                      <span className="text-white/30 hidden sm:inline">/</span>
                      <span className="text-white/60 text-sm truncate hidden sm:inline">
                        Module {activeModule?.number ?? ''}: {activeModule?.title ?? ''}
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0"
                  aria-label="Close curriculum"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex overflow-hidden relative">
                {activeModule ? (
                  <>
                    {/* Mobile sidebar backdrop */}
                    {sidebarOpen && (
                      <div 
                        className="absolute inset-0 bg-black/60 z-10 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                      />
                    )}

                    {/* Sidebar - hidden on mobile unless toggled, swipe left to dismiss */}
                    <div 
                      className={`
                        ${sidebarOpen ? 'block' : 'hidden'} lg:block
                        absolute lg:relative inset-y-0 left-0 z-20
                      `}
                      onTouchStart={(e) => setTouchStart(e.touches[0]?.clientX ?? null)}
                      onTouchEnd={(e) => {
                        const touchEndX = e.changedTouches[0]?.clientX;
                        if (touchStart !== null && touchEndX !== undefined && touchEndX - touchStart < -50) {
                          setSidebarOpen(false);
                        }
                        setTouchStart(null);
                      }}
                    >
                      <ModuleSidebar
                        modules={curriculumData.modules}
                        activeModuleId={activeModuleId}
                        activeSectionId={activeSectionId}
                        onNavigate={(moduleId, sectionId) => {
                          handleNavigate(moduleId, sectionId);
                          setSidebarOpen(false); // Close sidebar on mobile after navigation
                        }}
                      />
                    </div>

                    {/* Module Content */}
                    <ModuleContent
                      module={activeModule}
                      tools={curriculumData.tools}
                      activeSectionId={activeSectionId}
                    />
                  </>
                ) : (
                  /* Landing Page */
                  <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-8 py-16">
                      {/* Welcome */}
                      <div className="text-center mb-16">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            The AI Orchestration Masterclass
                          </h1>
                          <p className="text-xl text-white/60 mb-8">
                            Master the new stack. Ship features in 1/3 the time.
                          </p>
                          <div className="inline-block px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm">
                            6 Modules • 12 Tools • Real Projects
                          </div>
                        </motion.div>
                      </div>

                      {/* Module Cards */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
                      >
                        {curriculumData.modules.map((module, index) => (
                          <motion.button
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            onClick={() => handleNavigate(module.id)}
                            className="group text-left p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                                MODULE {module.number}
                              </span>
                              <span className="text-xs text-white/40 font-mono">
                                {module.duration}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                              {module.title}
                            </h3>

                            <p className="text-sm text-white/50 mb-4 line-clamp-2">
                              {module.objective}
                            </p>

                            <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono">
                              <span>Start Module</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>

                      {/* What You'll Learn */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/5 to-violet-500/5 border border-cyan-500/20"
                      >
                        <h3 className="text-xl font-bold text-white mb-4">
                          What You'll Master
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            'When to use each AI tool',
                            'Multi-agent orchestration',
                            'Cost optimization strategies',
                            'Debug workflows that work',
                            'Configuration over prompting',
                            'Ship features 3x faster',
                          ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-cyan-400 mt-1">✓</span>
                              <span className="text-white/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </div>
      </motion.div>
    </>
  );
};

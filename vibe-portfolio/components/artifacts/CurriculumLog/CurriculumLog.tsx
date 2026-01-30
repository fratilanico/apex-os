import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TerminalWindow, TerminalLine } from '../../ui/Terminal';
import { useTerminal } from '../../../hooks/useTerminal';
import { modules } from '../../../data/curriculumData';
import { CommandHandler } from './CommandHandler';
import { ModuleExpanded } from './ModuleExpanded';
import { ModulePreviewCard } from './ModulePreviewCard';
import { TimeEstimator } from './TimeEstimator';
import { useCurriculumStore } from '../../../stores';
import { motion } from 'framer-motion';
import type { Module } from '../../../types/curriculum';
import type { NLPSearchResult } from './NLPCommandParser';

type ViewMode = 'list' | 'module' | 'section' | 'time' | 'nlp';

interface CurriculumLogProps {
  className?: string;
}

interface TerminalState {
  viewMode: ViewMode;
  selectedModuleId: string | null;
  selectedSectionId: string | null;
  timestamp: number;
}

export const CurriculumLog = React.memo<CurriculumLogProps>(function CurriculumLog({ className = '' }) {
  const navigate = useNavigate();
  const { lines, isTyping, processSequence, addLine, clearTerminal } = useTerminal();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [commandHandler] = useState(() => new CommandHandler());
  const [awaitingInput, setAwaitingInput] = useState(false);
  
  // NLP state
  const [nlpResult, setNlpResult] = useState<NLPSearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Hover preview state
  const [hoveredModule, setHoveredModule] = useState<Module | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  
  // Session persistence state
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const sessionId = useRef(localStorage.getItem('curriculum-session-id') || 
    `curriculum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  // Boot guard: Prevents duplicate boot sequences in React StrictMode (flickering fix)
  const hasBootedRef = useRef(false);
  const stateRestoredRef = useRef(false);

  // Save session ID to localStorage
  useEffect(() => {
    localStorage.setItem('curriculum-session-id', sessionId.current);
  }, []);

  // Check for saved session on mount
  useEffect(() => {
    if (stateRestoredRef.current) return;
    
    const savedState = localStorage.getItem(`curriculum-state-${sessionId.current}`);
    if (savedState) {
      try {
        const state: TerminalState = JSON.parse(savedState);
        const isRecent = Date.now() - state.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          setLastSaveTime(new Date(state.timestamp));
          setShowResumePrompt(true);
        } else {
          // Clear old session
          localStorage.removeItem(`curriculum-state-${sessionId.current}`);
        }
      } catch (e) {
        console.warn('Failed to parse saved curriculum state:', e);
      }
    }
    stateRestoredRef.current = true;
  }, []);

  // Save state periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const state: TerminalState = {
        viewMode,
        selectedModuleId,
        selectedSectionId,
        timestamp: Date.now()
      };
      localStorage.setItem(`curriculum-state-${sessionId.current}`, JSON.stringify(state));
      setLastSaveTime(new Date());
    }, 5000);
    
    return () => clearInterval(saveInterval);
  }, [viewMode, selectedModuleId, selectedSectionId]);

  // Restore state
  const restoreState = useCallback(() => {
    const savedState = localStorage.getItem(`curriculum-state-${sessionId.current}`);
    if (savedState) {
      try {
        const state: TerminalState = JSON.parse(savedState);
        setViewMode(state.viewMode);
        setSelectedModuleId(state.selectedModuleId);
        setSelectedSectionId(state.selectedSectionId);
        
        // Restore command handler state
        if (state.selectedModuleId) {
          commandHandler.setMountedModule(state.selectedModuleId);
        }
        
        addLine({ text: '> ✓ SESSION RESTORED', type: 'success', delay: 100 } as any);
      } catch (e) {
        console.warn('Failed to restore curriculum state:', e);
      }
    }
    setShowResumePrompt(false);
  }, [addLine, commandHandler]);

  // Clear session and start fresh
  const clearSession = useCallback(() => {
    localStorage.removeItem(`curriculum-state-${sessionId.current}`);
    setShowResumePrompt(false);
    
    // Reset to defaults
    setViewMode('list');
    setSelectedModuleId(null);
    setSelectedSectionId(null);
    commandHandler.setMountedModule(null);
    
    addLine({ text: '> Starting fresh session...', type: 'system', delay: 100 } as any);
  }, [addLine, commandHandler]);

  // Transform module titles with founder-focused copy
  const transformModuleTitle = (title: string, number: string): string => {
    const transformations: Record<string, string> = {
      'The Shift': 'Phase 00: The Mindset Transfer',
      'The Environment': 'Phase 01: Breaking Ground',
      'Specifying': 'Phase 02: Configuration Mastery',
      'Orchestration': 'Phase 03: Agent Swarms',
      'Synthesis': 'Phase 04: Automating Operations',
      'Practicum': 'Launch Day: Shipping Your MVP',
    };
    return transformations[title] || `Phase ${number}: ${title}`;
  };

  // Initial auto-type on mount (with guard to prevent re-runs in StrictMode)
  useEffect(() => {
    // Skip if already booted - handles React StrictMode double-mount & view toggles
    if (hasBootedRef.current) return;
    hasBootedRef.current = true;
    
    // Skip boot sequence if we're showing resume prompt
    if (showResumePrompt) return;
    
    // Small delay to let the DOM settle after auth terminal closes
    const bootDelay = setTimeout(() => {
      const bootSequence = [
        { text: '> VIBE_CURRICULUM_BROWSER v3.0.0', type: 'system', delay: 300 },
        { text: '> LOADING MODULE_INDEX...', type: 'system', delay: 200 },
        { text: '> INITIALIZING NLP_ENGINE...', type: 'system', delay: 200 },
        { text: '> READY.', type: 'success', delay: 400 },
        { text: '', type: 'output', delay: 200 },
        { text: '> ls', type: 'input', delay: 600 },
      ];
      
      processSequence(bootSequence as any).then(() => {
        setAwaitingInput(false);
        setViewMode('list');
      });
    }, 200);
    
    return () => clearTimeout(bootDelay);
  }, [processSequence, showResumePrompt]); // Safe dependency - processSequence is memoized in useTerminal

  // Handle module click (auto-types "mount" command)
  const handleModuleClick = useCallback(async (moduleNumber: string) => {
    setAwaitingInput(true);
    await processSequence([
      { text: `> mount ${moduleNumber}`, type: 'input', showPrompt: false, delay: 100 },
      { text: '> MOUNTING MODULE...', type: 'system', delay: 300 },
      { text: '> DECRYPTING CONTENT...', type: 'system', delay: 200 },
    ] as any);
    
    const module = modules.find(m => m.number === moduleNumber);
    if (module) {
      setSelectedModuleId(module.id);
      commandHandler.setMountedModule(module.id);
      setViewMode('module');
    }
    setAwaitingInput(false);
  }, [processSequence, commandHandler]);

  // Handle section click (auto-types "cat" command)
  const handleSectionClick = useCallback(async (sectionId: string) => {
    setAwaitingInput(true);
    await processSequence([
      { text: `> cat ${sectionId}`, type: 'input', showPrompt: false, delay: 100 },
      { text: '> LOADING SECTION...', type: 'system', delay: 200 },
    ] as any);
    
    setSelectedSectionId(sectionId);
    setViewMode('section');
    setAwaitingInput(false);
  }, [processSequence]);

  // Check if command is showmethemoney (flexible matching)
  const isShowMeTheMoneyCommand = useCallback((cmd: string): boolean => {
    const normalized = cmd.toLowerCase().replace(/\s/g, '');
    const lowerCmd = cmd.toLowerCase();
    return (
      normalized === 'showmethemoney' ||
      normalized.includes('showmethemoney') ||
      lowerCmd.includes('money') ||
      lowerCmd.includes('financial') ||
      lowerCmd.includes('business plan') ||
      lowerCmd.includes('businessplan')
    );
  }, []);

  // Manual command handler
  const handleCommand = useCallback(async (cmd: string) => {
    setAwaitingInput(true);
    addLine({ text: `> ${cmd}`, type: 'input', showPrompt: false } as any);

    // Check for showmethemoney command FIRST (before other processing)
    if (isShowMeTheMoneyCommand(cmd)) {
      await processSequence([
        { text: '> 🔓 ACCESSING FINANCIAL VAULT...', type: 'system', delay: 600 },
        { text: '> 📊 LOADING_BUSINESS_PLAN_V1.0...', type: 'system', delay: 500 },
        { text: '> 💰 FINANCIAL_PROJECTIONS_DECRYPTED', type: 'success', delay: 400 },
        { text: '> ✓ CLEARANCE_GRANTED', type: 'success', delay: 300 },
        { text: '> REDIRECTING_TO_SECURE_VAULT...', type: 'system', delay: 400 },
      ] as any);
      setTimeout(() => navigate('/showmethemoney'), 1200);
      return;
    }

    const parsed = commandHandler.parseCommand(cmd);

    switch (parsed.type) {
      case 'ls':
        await processSequence([{ text: '> LISTING MODULES...', type: 'system', delay: 200 }] as any);
        setViewMode('list');
        setSelectedModuleId(null);
        commandHandler.setMountedModule(null);
        break;

      case 'mount':
        if (!parsed.args[0]) {
          await processSequence([
            { text: 'ERROR: mount requires module ID (e.g., "mount 01")', type: 'error', delay: 100 },
          ] as any);
        } else {
          const moduleNum = parsed.args[0].padStart(2, '0');
          const module = modules.find(m => m.number === moduleNum);
          if (module) {
            await handleModuleClick(moduleNum);
          } else {
            await processSequence([
              { text: `ERROR: Module ${moduleNum} not found`, type: 'error', delay: 100 },
            ] as any);
          }
        }
        break;

      case 'cat':
        if (!parsed.args[0]) {
          await processSequence([
            { text: 'ERROR: cat requires section ID (e.g., "cat 01.2")', type: 'error', delay: 100 },
          ] as any);
        } else {
          await handleSectionClick(parsed.args[0]);
        }
        break;

      case 'time':
        await processSequence([
          { text: '> LOADING TIME ESTIMATOR...', type: 'system', delay: 200 },
          { text: '> CALCULATING TIMELINE...', type: 'system', delay: 200 },
        ] as any);
        setViewMode('time');
        break;

      case 'help':
        await processSequence([
          { text: commandHandler.getHelpText(), type: 'output', delay: 100 },
        ] as any);
        break;

      case 'admin':
        await processSequence([
          { text: '> INITIALIZING_ADMIN_PROTOCOL...', type: 'system', delay: 800 },
          { text: '> REDIRECTING...', type: 'system', delay: 800 },
        ] as any);
        setTimeout(() => navigate('/admin'), 1000);
        return;

      case 'clear':
        clearTerminal();
        await processSequence([
          { text: '> VIBE_CURRICULUM_BROWSER v2.1.0', type: 'system', delay: 100 },
        ] as any);
        setViewMode('list');
        break;

      case 'next':
        if (selectedModule && selectedSectionId) {
          const currentIndex = selectedModule.sections.findIndex(s => s.id === selectedSectionId);
          const nextSection = selectedModule.sections[currentIndex + 1];
          if (nextSection) {
            await processSequence([
              { text: '> ADVANCING TO NEXT SECTION...', type: 'system', delay: 200 },
            ] as any);
            await handleSectionClick(nextSection.id);
          } else {
            await processSequence([
              { text: '> Already at last section of this module', type: 'error', delay: 100 },
            ] as any);
          }
        } else {
          await processSequence([
            { text: '> ERROR: No section currently active. Use "cat [section-id]" first.', type: 'error', delay: 100 },
          ] as any);
        }
        break;

      case 'prev':
        if (selectedModule && selectedSectionId) {
          const currentIndex = selectedModule.sections.findIndex(s => s.id === selectedSectionId);
          const prevSection = selectedModule.sections[currentIndex - 1];
          if (prevSection) {
            await processSequence([
              { text: '> RETURNING TO PREVIOUS SECTION...', type: 'system', delay: 200 },
            ] as any);
            await handleSectionClick(prevSection.id);
          } else {
            await processSequence([
              { text: '> Already at first section of this module', type: 'error', delay: 100 },
            ] as any);
          }
        } else {
          await processSequence([
            { text: '> ERROR: No section currently active. Use "cat [section-id]" first.', type: 'error', delay: 100 },
          ] as any);
        }
        break;

      case 'complete':
        if (selectedSectionId) {
          const { completeSection } = useCurriculumStore.getState();
          completeSection(selectedSectionId);
          await processSequence([
            { text: `> MARKING SECTION ${selectedSectionId} AS COMPLETED...`, type: 'system', delay: 300 },
            { text: '> ✓ PROGRESS SAVED!', type: 'success', delay: 200 },
          ] as any);
        } else {
          await processSequence([
            { text: '> ERROR: No section currently active. Use "cat [section-id]" first.', type: 'error', delay: 100 },
          ] as any);
        }
        break;

      case 'progress':
        const { getOverallProgress } = useCurriculumStore.getState();
        const progress = getOverallProgress();
        await processSequence([
          { text: `> OVERALL CURRICULUM PROGRESS: ${progress}%`, type: 'success', delay: 200 },
          { text: `> ${progress >= 100 ? 'ALL MODULES COMPLETED! 🎉' : progress > 50 ? 'Halfway there! Keep going! 💪' : 'Just getting started! You got this! 🚀'}`, type: 'output', delay: 100 },
        ] as any);
        break;

      case 'nlp':
        await processSequence([
          { text: '> PROCESSING NATURAL LANGUAGE QUERY...', type: 'system', delay: 300 },
        ] as any);
        const { result, formatted } = commandHandler.processNLPQuery(cmd);
        if (result) {
          setNlpResult(result);
          setViewMode('nlp');
        }
        await processSequence([
          { text: formatted, type: 'output', delay: 100 },
        ] as any);
        break;

      default:
        await processSequence([
          { text: `ERROR: Unknown command "${cmd}". Type "help" for available commands.`, type: 'error', delay: 100 },
        ] as any);
    }

    setAwaitingInput(false);
  }, [addLine, processSequence, commandHandler, clearTerminal, handleModuleClick, handleSectionClick, navigate, isShowMeTheMoneyCommand]);

  const selectedModule = selectedModuleId 
    ? modules.find(m => m.id === selectedModuleId) 
    : null;

  const selectedSection = selectedSectionId && selectedModule
    ? selectedModule.sections.find(s => s.id === selectedSectionId)
    : null;

  // Handle module hover with position tracking
  const handleModuleMouseEnter = useCallback((module: Module, event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 768) return;
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Position card to the right of the button with some spacing
    setPreviewPosition({
      x: rect.right + 16, // 16px spacing
      y: rect.top - 20,   // Slight upward offset for better alignment
    });
    
    setHoveredModule(module);
  }, []);

  const handleModuleMouseLeave = useCallback(() => {
    setHoveredModule(null);
  }, []);

  return (
    <TerminalWindow title="curriculum_log.sh" className={className}>
      <div className="space-y-3 pointer-events-auto">
        {/* Resume Session Prompt */}
        {showResumePrompt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4 pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="text-cyan-400 text-lg">💾</div>
              <div className="flex-1">
                <div className="text-cyan-400 font-bold text-sm mb-1">
                  Previous Session Found
                </div>
                <div className="text-white/70 text-xs mb-3">
                  Last saved: {lastSaveTime?.toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={restoreState}
                    className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-xs hover:bg-cyan-500/30 transition-all pointer-events-auto touch-manipulation min-h-[44px]"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Resume Session
                  </button>
                  <button
                    onClick={clearSession}
                    className="px-3 py-1.5 bg-white/5 border border-white/20 rounded text-white/60 text-xs hover:bg-white/10 transition-all pointer-events-auto touch-manipulation min-h-[44px]"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Render terminal lines */}
        {lines.map((line, i) => (
          <TerminalLine key={i} {...line} />
        ))}

        {/* Module List View */}
        {viewMode === 'list' && !isTyping && !awaitingInput && !showResumePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 mt-4 pointer-events-auto"
          >
            <div className="text-cyan-400 text-xs font-bold tracking-wider mb-3">
              AVAILABLE PHASES:
            </div>
            {modules.map((module) => (
              <motion.button
                key={module.id}
                onClick={() => handleModuleClick(module.number)}
                onMouseEnter={(e) => handleModuleMouseEnter(module, e)}
                onMouseLeave={handleModuleMouseLeave}
                whileHover={{ x: 4 }}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-cyan-500/30 transition-all group pointer-events-auto touch-manipulation min-h-[44px]"
                style={{ touchAction: 'manipulation' }}
              >
                <span className="text-cyan-500 text-sm font-mono font-bold shrink-0">
                  {module.number}
                </span>
                <div className="flex-1">
                  <div className="text-white/90 text-sm font-medium group-hover:text-cyan-400 transition-colors">
                    {transformModuleTitle(module.title, module.number)}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">
                    {module.subtitle} · {module.duration}
                  </div>
                </div>
                <span className="text-white/20 group-hover:text-cyan-500/50 transition-colors">
                  →
                </span>
              </motion.button>
            ))}
            
            <div className="pt-4 border-t border-white/10 mt-6 pointer-events-none">
              <div className="text-white/30 text-xs mb-2">
                💡 <span className="text-white/50">Click a phase or type commands: </span>
                <code className="text-cyan-400">time</code> (plan journey),
                <code className="text-cyan-400 ml-1">mount [id]</code>,
                <code className="text-cyan-400 ml-1">help</code>
              </div>
              <div className="text-violet-400/60 text-xs">
                🤖 <span className="text-violet-300/70">Or ask naturally: </span>
                <span className="italic">"What is the shift mindset?"</span>,
                <span className="italic ml-1">"How do I use Cursor?"</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Module Detail View */}
        {viewMode === 'module' && selectedModule && !isTyping && !awaitingInput && (
          <div className="mt-4 pointer-events-auto">
            <ModuleExpanded 
              module={selectedModule} 
              onSectionClick={handleSectionClick}
            />
            <div className="pt-4 mt-4 border-t border-white/10 pointer-events-none">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Click a section, or type: </span>
                <code className="text-cyan-400">ls</code> (back to list), 
                <code className="text-cyan-400 ml-1">cat [id]</code> (view section)
              </div>
            </div>
          </div>
        )}

        {/* Section Content View - FULL CONTENT */}
        {viewMode === 'section' && selectedSection && !isTyping && !awaitingInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3 pointer-events-auto"
          >
            <div className="border-l-2 border-emerald-500/40 pl-4">
              <div className="text-emerald-400 text-xs uppercase tracking-widest mb-1">
                SECTION {selectedSection.id} / {selectedModule?.sections.length}
              </div>
              <div className="text-white font-bold text-lg">{selectedSection.title}</div>
              {selectedSection.duration && (
                <div className="text-white/40 text-xs mt-1">⏱ {selectedSection.duration}</div>
              )}
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded p-4 mt-3">
              <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
                {selectedSection.content}
              </div>
            </div>

            {/* Section Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 pointer-events-auto">
              <button
                onClick={() => {
                  const currentIndex = selectedModule?.sections.findIndex(s => s.id === selectedSectionId) ?? 0;
                  const prevSection = selectedModule?.sections[currentIndex - 1];
                  if (prevSection) {
                    handleSectionClick(prevSection.id);
                  }
                }}
                disabled={(selectedModule?.sections.findIndex(s => s.id === selectedSectionId) ?? 0) === 0}
                className="px-3 py-1.5 rounded bg-white/[0.05] border border-white/10 text-white/60 text-xs hover:bg-white/[0.1] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all pointer-events-auto touch-manipulation min-h-[44px]"
                style={{ touchAction: 'manipulation' }}
              >
                ← Previous
              </button>
              
              <span className="text-white/30 text-xs">
                {(selectedModule?.sections.findIndex(s => s.id === selectedSectionId) ?? 0) + 1} / {selectedModule?.sections.length}
              </span>
              
              <button
                onClick={() => {
                  const currentIndex = selectedModule?.sections.findIndex(s => s.id === selectedSectionId) ?? 0;
                  const nextSection = selectedModule?.sections[currentIndex + 1];
                  if (nextSection) {
                    handleSectionClick(nextSection.id);
                  }
                }}
                disabled={(selectedModule?.sections.findIndex(s => s.id === selectedSectionId) ?? 0) === (selectedModule?.sections.length ?? 1) - 1}
                className="px-3 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all pointer-events-auto touch-manipulation min-h-[44px]"
                style={{ touchAction: 'manipulation' }}
              >
                Next →
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 pointer-events-none">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Type: </span>
                <code className="text-cyan-400">ls</code> (module list), 
                <code className="text-cyan-400 ml-1">mount {selectedModule?.number}</code> (back to module)
              </div>
            </div>
          </motion.div>
        )}

        {/* Time Estimator View */}
        {viewMode === 'time' && !isTyping && !awaitingInput && (
          <div className="mt-4 pointer-events-auto">
            <TimeEstimator 
              onClose={() => {
                setViewMode('list');
                addLine({ text: '> ls', type: 'input', showPrompt: false } as any);
              }}
            />
            <div className="pt-4 mt-4 border-t border-white/10 pointer-events-none">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Type: </span>
                <code className="text-cyan-400">ls</code> (back to list), 
                <code className="text-cyan-400 ml-1">help</code> (show commands)
              </div>
            </div>
          </div>
        )}

        {/* NLP Results View */}
        {viewMode === 'nlp' && nlpResult && !isTyping && !awaitingInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3 pointer-events-auto"
          >
            <div className="border-l-2 border-violet-500/40 pl-4">
              <div className="text-violet-400 text-xs uppercase tracking-widest mb-1">
                🤖 AI RESPONSE
              </div>
              <div className="text-white font-bold text-lg">{nlpResult.title}</div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded p-4 mt-3">
              <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
                {nlpResult.content}
              </div>
            </div>

            {/* Related Content */}
            {nlpResult.relatedSections && nlpResult.relatedSections.length > 0 && (
              <div className="bg-white/[0.02] border border-white/10 rounded p-3 pointer-events-auto">
                <div className="text-cyan-400 text-xs font-bold mb-2">RELATED SECTIONS:</div>
                <div className="space-y-1.5">
                  {nlpResult.relatedSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className="w-full text-left px-2 py-1.5 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 transition-all text-xs text-white/70 hover:text-cyan-400 pointer-events-auto touch-manipulation min-h-[44px]"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {section.id}: {section.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {nlpResult.suggestions && nlpResult.suggestions.length > 0 && (
              <div className="bg-violet-500/5 border border-violet-500/20 rounded p-3 pointer-events-auto">
                <div className="text-violet-400 text-xs font-bold mb-2">TRY ASKING:</div>
                <div className="space-y-1">
                  {nlpResult.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCommand(suggestion)}
                      className="w-full text-left px-2 py-1 rounded hover:bg-violet-500/10 transition-colors text-xs text-white/60 hover:text-violet-300 pointer-events-auto touch-manipulation min-h-[44px]"
                      style={{ touchAction: 'manipulation' }}
                    >
                      → {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 pointer-events-none">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Type: </span>
                <code className="text-cyan-400">ls</code> (module list), 
                <code className="text-cyan-400 ml-1">help</code> (commands), 
                <code className="text-cyan-400 ml-1">clear</code> (reset)
              </div>
            </div>
          </motion.div>
        )}

        {/* Command Input (always available when not typing) */}
        {!isTyping && !awaitingInput && !showResumePrompt && (
          <div className="mt-6 pt-4 border-t border-white/10 relative pointer-events-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input') as HTMLInputElement;
              if (input.value.trim()) {
                handleCommand(input.value.trim());
                input.value = '';
                setShowSuggestions(false);
              }
            }}>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 shrink-0">❯</span>
                <input
                  type="text"
                  placeholder="Type command or ask naturally: 'What is X?'..."
                  className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder:text-white/20 font-mono text-base md:text-sm pointer-events-auto"
                  style={{ touchAction: 'manipulation', minHeight: '44px' }}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length >= 2) {
                      const newSuggestions = commandHandler.getNLPSuggestions(value);
                      setSuggestions(newSuggestions);
                      setShowSuggestions(newSuggestions.length > 0);
                    } else {
                      setShowSuggestions(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                />
              </div>
            </form>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-6 right-0 bottom-full mb-1 bg-black/90 border border-cyan-500/30 rounded-md overflow-hidden shadow-lg shadow-cyan-500/10 z-50 pointer-events-auto">
                <div className="px-3 py-1.5 text-xs text-cyan-400/60 border-b border-white/5">
                  Try asking naturally:
                </div>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleCommand(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors border-b border-white/5 last:border-0 pointer-events-auto touch-manipulation min-h-[44px]"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Preview Card (rendered outside terminal content, positioned absolutely) */}
      {viewMode === 'list' && !isTyping && !awaitingInput && (
        <ModulePreviewCard 
          module={hoveredModule} 
          position={previewPosition}
        />
      )}
    </TerminalWindow>
  );
});

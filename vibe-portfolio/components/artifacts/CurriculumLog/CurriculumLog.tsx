import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TerminalWindow, TerminalLine } from '../../ui/Terminal';
import { useTerminal } from '../../../hooks/useTerminal';
import { modules } from '../../../data/curriculumData';
import { CommandHandler } from './CommandHandler';
import { ModuleExpanded } from './ModuleExpanded';
import { ModulePreviewCard } from './ModulePreviewCard';
import { TimeEstimator } from './TimeEstimator';
import { motion } from 'framer-motion';
import type { Module } from '../../../types/curriculum';

type ViewMode = 'list' | 'module' | 'section' | 'time';

interface CurriculumLogProps {
  className?: string;
}

export const CurriculumLog = React.memo<CurriculumLogProps>(function CurriculumLog({ className = '' }) {
  const navigate = useNavigate();
  const { lines, isTyping, processSequence, addLine, clearTerminal } = useTerminal();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [commandHandler] = useState(() => new CommandHandler());
  const [awaitingInput, setAwaitingInput] = useState(false);
  
  // Hover preview state
  const [hoveredModule, setHoveredModule] = useState<Module | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  
  // Boot guard: Prevents duplicate boot sequences in React StrictMode (flickering fix)
  const hasBootedRef = useRef(false);

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
    
    // Small delay to let the DOM settle after auth terminal closes
    const bootDelay = setTimeout(() => {
      const bootSequence = [
        { text: '> VIBE_CURRICULUM_BROWSER v2.1.0', type: 'system', delay: 300 },
        { text: '> LOADING MODULE_INDEX...', type: 'system', delay: 200 },
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
  }, [processSequence]); // Safe dependency - processSequence is memoized in useTerminal

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

  // Manual command handler
  const handleCommand = useCallback(async (cmd: string) => {
    setAwaitingInput(true);
    addLine({ text: `> ${cmd}`, type: 'input', showPrompt: false } as any);

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

      default:
        await processSequence([
          { text: `ERROR: Unknown command "${cmd}". Type "help" for available commands.`, type: 'error', delay: 100 },
        ] as any);
    }

    setAwaitingInput(false);
  }, [addLine, processSequence, commandHandler, clearTerminal, handleModuleClick, handleSectionClick]);

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
      <div className="space-y-3">
        {/* Render terminal lines */}
        {lines.map((line, i) => (
          <TerminalLine key={i} {...line} />
        ))}

        {/* Module List View */}
        {viewMode === 'list' && !isTyping && !awaitingInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 mt-4"
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
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-cyan-500/30 transition-all group"
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
            
            <div className="pt-4 border-t border-white/10 mt-6">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Click a phase or type commands: </span>
                <code className="text-cyan-400">time</code> (plan journey), 
                <code className="text-cyan-400 ml-1">mount [id]</code>, 
                <code className="text-cyan-400 ml-1">help</code>
              </div>
            </div>
          </motion.div>
        )}

        {/* Module Detail View */}
        {viewMode === 'module' && selectedModule && !isTyping && !awaitingInput && (
          <div className="mt-4">
            <ModuleExpanded 
              module={selectedModule} 
              onSectionClick={handleSectionClick}
            />
            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Click a section, or type: </span>
                <code className="text-cyan-400">ls</code> (back to list), 
                <code className="text-cyan-400 ml-1">cat [id]</code> (view section)
              </div>
            </div>
          </div>
        )}

        {/* Section Content View */}
        {viewMode === 'section' && selectedSection && !isTyping && !awaitingInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3"
          >
            <div className="border-l-2 border-emerald-500/40 pl-4">
              <div className="text-emerald-400 text-xs uppercase tracking-widest mb-1">
                SECTION {selectedSection.id}
              </div>
              <div className="text-white font-bold text-lg">{selectedSection.title}</div>
              {selectedSection.duration && (
                <div className="text-white/40 text-xs mt-1">⏱ {selectedSection.duration}</div>
              )}
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded p-4 mt-3">
              <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                {selectedSection.content.split('\n').slice(0, 20).join('\n')}
                {selectedSection.content.split('\n').length > 20 && (
                  <div className="text-cyan-400 mt-4 text-xs">
                    ... [Content truncated. Visit full curriculum for complete section] ...
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
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
          <div className="mt-4">
            <TimeEstimator 
              onClose={() => {
                setViewMode('list');
                addLine({ text: '> ls', type: 'input', showPrompt: false } as any);
              }}
            />
            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="text-white/30 text-xs">
                💡 <span className="text-white/50">Type: </span>
                <code className="text-cyan-400">ls</code> (back to list), 
                <code className="text-cyan-400 ml-1">help</code> (show commands)
              </div>
            </div>
          </div>
        )}

        {/* Command Input (always available when not typing) */}
        {!isTyping && !awaitingInput && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input') as HTMLInputElement;
              if (input.value.trim()) {
                handleCommand(input.value.trim());
                input.value = '';
              }
            }}>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 shrink-0">❯</span>
                <input
                  type="text"
                  placeholder="Type command (or click items above)..."
                  className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder:text-white/20 font-mono text-base md:text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </form>
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

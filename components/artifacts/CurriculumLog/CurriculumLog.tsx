import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TerminalWindow, TerminalLine } from '../../ui/Terminal';
import type { TerminalLine as TerminalLineType } from '../../../hooks/useTerminal';
import { useTerminal } from '../../../hooks/useTerminal';
import { useCurriculumStore } from '../../../stores/useCurriculumStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { CommandHandler, getCommandRegistry } from './CommandHandler';
import { ModuleExpanded } from './ModuleExpanded';
import { ModulePreviewCard } from './ModulePreviewCard';
import { TimeEstimator } from './TimeEstimator';
import { motion } from 'framer-motion';
import type { Module } from '../../../types/curriculum';

type ViewMode = 'list' | 'module' | 'section' | 'time';

interface TerminalSession {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  lines: TerminalLineType[];
  viewMode: ViewMode;
  selectedModuleId: string | null;
  selectedSectionId: string | null;
  commandHistory: string[];
}

interface MenuItem {
  id: string;
  label: string;
  description: string;
  kind: 'command' | 'session' | 'action';
  commandName?: string;
  usage?: string;
  sessionId?: string;
}

const SESSION_STORAGE_KEY = 'vibe-curriculum-sessions';
const MAX_SESSION_NAME_LENGTH = 40;

const createSessionId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const formatSessionName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return 'New Session';
  if (trimmed.length <= MAX_SESSION_NAME_LENGTH) return trimmed;
  return `${trimmed.slice(0, MAX_SESSION_NAME_LENGTH - 3)}...`;
};

const normalizePrompt = (value: string): string => value.replace(/^>\s?/, '').trim();

const getFirstPromptFromLines = (lines: TerminalLineType[]): string => {
  const firstInput = lines.find((line) => line.type === 'input' && line.text.trim());
  return firstInput ? normalizePrompt(firstInput.text) : '';
};

const deriveCommandHistory = (lines: TerminalLineType[]): string[] => (
  lines
    .filter((line) => line.type === 'input')
    .map((line) => normalizePrompt(line.text))
    .filter((text) => text.length > 0)
);

const normalizeSession = (value: unknown): TerminalSession | null => {
  if (!value || typeof value !== 'object') return null;
  const session = value as Partial<TerminalSession>;
  if (!session.id || typeof session.id !== 'string') return null;
  return {
    id: session.id,
    name: typeof session.name === 'string' ? session.name : 'New Session',
    createdAt: typeof session.createdAt === 'number' ? session.createdAt : Date.now(),
    updatedAt: typeof session.updatedAt === 'number' ? session.updatedAt : Date.now(),
    lines: Array.isArray(session.lines) ? session.lines : [],
    viewMode: (session.viewMode as ViewMode) || 'list',
    selectedModuleId: session.selectedModuleId ?? null,
    selectedSectionId: session.selectedSectionId ?? null,
    commandHistory: Array.isArray(session.commandHistory) ? session.commandHistory : [],
  };
};

const loadSessions = (): TerminalSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeSession).filter((session): session is TerminalSession => Boolean(session));
  } catch {
    return [];
  }
};

const saveSessions = (sessions: TerminalSession[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    return;
  }
};

interface CurriculumLogProps {
  className?: string;
}

export const CurriculumLog = React.memo<CurriculumLogProps>(function CurriculumLog({ className = '' }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TerminalSession[]>(() => loadSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const currentSession = useMemo(
    () => sessions.find((session) => session.id === currentSessionId) ?? null,
    [currentSessionId, sessions]
  );
  const initialLines = useMemo(
    () => currentSession?.lines ?? [],
    [currentSession]
  );
  const { lines, isTyping, processSequence, addLine, clearTerminal, setLines } = useTerminal({
    initialLines,
  });
  const { modules, loadModules } = useCurriculumStore();
  const { track } = useAnalytics();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [commandHandler] = useState(() => new CommandHandler());
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const commandRegistry = useMemo(() => getCommandRegistry(), []);
  
  // Hover preview state
  const [hoveredModule, setHoveredModule] = useState<Module | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  
  // Boot guard: Prevents duplicate boot sequences in React StrictMode (flickering fix)
  const hasBootedRef = useRef(false);

  useEffect(() => {
    loadModules().catch(() => undefined);
  }, [loadModules]);

  const runBootSequence = useCallback(() => {
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
  }, [processSequence]);

  const createSession = useCallback((): TerminalSession => {
    const now = Date.now();
    return {
      id: createSessionId(),
      name: 'New Session',
      createdAt: now,
      updatedAt: now,
      lines: [],
      viewMode: 'list',
      selectedModuleId: null,
      selectedSectionId: null,
      commandHistory: [],
    };
  }, []);

  const applySessionState = useCallback((session: TerminalSession) => {
    setLines(session.lines);
    setViewMode(session.viewMode || 'list');
    setSelectedModuleId(session.selectedModuleId ?? null);
    setSelectedSectionId(session.selectedSectionId ?? null);
    const nextHistory = session.commandHistory.length > 0
      ? session.commandHistory
      : deriveCommandHistory(session.lines);
    setCommandHistory(nextHistory);
    setHistoryIndex(-1);
    setInputValue('');
    setMenuOpen(false);
  }, [setLines]);

  const getSessionLabel = useCallback((session: TerminalSession): string => {
    if (session.name && session.name !== 'New Session') {
      return session.name;
    }
    return formatSessionName(getFirstPromptFromLines(session.lines));
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;
    setCurrentSessionId(sessionId);
    applySessionState(session);
  }, [applySessionState, sessions]);

  const deleteSession = useCallback((sessionId: string) => {
    if (!confirm('Delete this session?')) return;
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    if (currentSessionId !== sessionId) return;

    const remaining = sessions.filter((session) => session.id !== sessionId);
    if (remaining.length > 0) {
      const next = remaining.sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (next) {
        setCurrentSessionId(next.id);
        applySessionState(next);
        return;
      }
    }

    const newSession = createSession();
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
    applySessionState(newSession);
    setAwaitingInput(true);
    runBootSequence();
  }, [applySessionState, createSession, currentSessionId, runBootSequence, sessions]);

  useEffect(() => {
    if (currentSessionId) return;
    if (sessions.length > 0) {
      const mostRecent = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (mostRecent) {
        setCurrentSessionId(mostRecent.id);
        applySessionState(mostRecent);
      }
      return;
    }
    const newSession = createSession();
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
    applySessionState(newSession);
  }, [applySessionState, createSession, currentSessionId, sessions]);

  const handleNewSession = useCallback(() => {
    const newSession = createSession();
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    applySessionState(newSession);
    setAwaitingInput(true);
    runBootSequence();
  }, [applySessionState, createSession, runBootSequence]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    if (!currentSessionId) return;
    setSessions((prev) => {
      const session = prev.find((item) => item.id === currentSessionId);
      if (!session) return prev;
      const firstPrompt = getFirstPromptFromLines(lines);
      const nextName = session.name === 'New Session'
        ? formatSessionName(firstPrompt)
        : session.name;
      const updated: TerminalSession = {
        ...session,
        name: nextName,
        lines,
        viewMode,
        selectedModuleId,
        selectedSectionId,
        commandHistory,
        updatedAt: Date.now(),
      };
      return prev.map((item) => item.id === currentSessionId ? updated : item);
    });
  }, [commandHistory, currentSessionId, lines, selectedModuleId, selectedSectionId, viewMode]);

  const menuQuery = inputValue.trim().startsWith('/')
    ? inputValue.trim().slice(1).toLowerCase()
    : '';

  const commandMenuItems = useMemo<MenuItem[]>(() => (
    commandRegistry.map((cmd) => ({
      id: `command-${cmd.name}`,
      label: cmd.name,
      description: cmd.description,
      kind: 'command',
      commandName: cmd.name,
      usage: cmd.usage,
    }))
  ), [commandRegistry]);

  const sessionMenuItems = useMemo<MenuItem[]>(() => (
    [...sessions]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((session) => {
        const derived = session.name === 'New Session'
          ? formatSessionName(getFirstPromptFromLines(session.lines))
          : session.name;
        return {
          id: `session-${session.id}`,
          label: derived,
          description: 'Resume session',
          kind: 'session',
          sessionId: session.id,
        };
      })
  ), [sessions]);

  const actionMenuItems = useMemo<MenuItem[]>(() => ([
    {
      id: 'new-session',
      label: 'New session',
      description: 'Start a fresh terminal session',
      kind: 'action',
    },
  ]), []);

  const menuItems = useMemo(() => {
    const allItems = [...actionMenuItems, ...commandMenuItems, ...sessionMenuItems];
    if (!menuQuery) return allItems;
    const query = menuQuery.toLowerCase();
    return allItems.filter((item) => (
      item.label.toLowerCase().includes(query)
      || item.description.toLowerCase().includes(query)
      || (item.commandName ? item.commandName.toLowerCase().includes(query) : false)
      || (item.usage ? item.usage.toLowerCase().includes(query) : false)
    ));
  }, [actionMenuItems, commandMenuItems, menuQuery, sessionMenuItems]);

  const currentSessionName = useMemo(() => {
    if (!currentSession) return 'New Session';
    return getSessionLabel(currentSession);
  }, [currentSession, getSessionLabel]);

  useEffect(() => {
    if (!inputValue.trim().startsWith('/')) {
      if (menuOpen) setMenuOpen(false);
      setMenuIndex(0);
      return;
    }
    setMenuOpen(true);
    setMenuIndex(0);
  }, [inputValue, menuOpen]);

  useEffect(() => {
    if (menuItems.length === 0) {
      setMenuIndex(0);
      return;
    }
    setMenuIndex((current) => Math.min(current, menuItems.length - 1));
  }, [menuItems.length]);

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
    if (currentSession && currentSession.lines.length > 0) return;
    if (lines.length > 0) return;
    hasBootedRef.current = true;

    // Small delay to let the DOM settle after auth terminal closes
    const bootDelay = setTimeout(() => {
      runBootSequence();
    }, 200);

    return () => clearTimeout(bootDelay);
  }, [currentSession, lines.length, runBootSequence]);

  // Handle module click (auto-types "mount" command)
  const handleModuleClick = useCallback(async (moduleNumber: string) => {
    setAwaitingInput(true);
    setCommandHistory((prev) => [...prev.slice(-49), `mount ${moduleNumber}`]);
    setHistoryIndex(-1);
    const selectedModule = modules.find(m => m.number === moduleNumber);
    track('curriculum_module_select', { moduleNumber, moduleId: selectedModule?.id ?? null, moduleTitle: selectedModule?.title ?? null });
    await processSequence([
      { text: `> mount ${moduleNumber}`, type: 'input', showPrompt: false, delay: 100 },
      { text: '> MOUNTING MODULE...', type: 'system', delay: 300 },
      { text: '> DECRYPTING CONTENT...', type: 'system', delay: 200 },
    ] as any);
    
    if (selectedModule) {
      setSelectedModuleId(selectedModule.id);
      commandHandler.setMountedModule(selectedModule.id);
      setViewMode('module');
    }
    setAwaitingInput(false);
  }, [processSequence, commandHandler, modules, track]);

  // Handle section click (auto-types "cat" command)
  const handleSectionClick = useCallback(async (sectionId: string) => {
    setAwaitingInput(true);
    setCommandHistory((prev) => [...prev.slice(-49), `cat ${sectionId}`]);
    setHistoryIndex(-1);
    track('curriculum_section_select', { sectionId, moduleId: selectedModuleId });
    await processSequence([
      { text: `> cat ${sectionId}`, type: 'input', showPrompt: false, delay: 100 },
      { text: '> LOADING SECTION...', type: 'system', delay: 200 },
    ] as any);
    
    setSelectedSectionId(sectionId);
    setViewMode('section');
    setAwaitingInput(false);
  }, [processSequence, track, selectedModuleId]);

  // Manual command handler
  const handleCommand = useCallback(async (cmd: string) => {
    setAwaitingInput(true);
    const trimmed = cmd.trim();
    if (!trimmed) {
      setAwaitingInput(false);
      return;
    }

    track('curriculum_command', { command: trimmed, moduleId: selectedModuleId, sectionId: selectedSectionId });

    const normalized = trimmed.startsWith('/') ? trimmed.slice(1).trim() : trimmed;
    if (!normalized) {
      setAwaitingInput(false);
      return;
    }

    setCommandHistory((prev) => [...prev.slice(-49), normalized]);
    setHistoryIndex(-1);
    addLine({ text: `> ${normalized}`, type: 'input', showPrompt: false } as any);

    const parsed = commandHandler.parseCommand(normalized);

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
  }, [addLine, processSequence, commandHandler, clearTerminal, handleModuleClick, handleSectionClick, track, selectedModuleId, selectedSectionId]);

  const runMenuItem = useCallback((item: MenuItem) => {
    if (item.kind === 'command' && item.commandName) {
      handleCommand(item.commandName);
      return;
    }
    if (item.kind === 'session' && item.sessionId) {
      switchSession(item.sessionId);
      return;
    }
    if (item.kind === 'action') {
      handleNewSession();
    }
  }, [handleCommand, handleNewSession, switchSession]);

  const handleInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (menuOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (menuItems.length > 0) {
          setMenuIndex((idx) => (idx + 1) % menuItems.length);
        }
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (menuItems.length > 0) {
          setMenuIndex((idx) => (idx - 1 + menuItems.length) % menuItems.length);
        }
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        if (menuItems.length > 0) {
          const selected = menuItems[menuIndex];
          if (!selected) return;
          setMenuOpen(false);
          setInputValue('');
          runMenuItem(selected);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
      }

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputValue(commandHistory[nextIdx] || '');
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex === commandHistory.length - 1
          ? -1
          : historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputValue(nextIdx === -1 ? '' : commandHistory[nextIdx] || '');
      }
    }
  }, [commandHistory, historyIndex, menuItems, menuIndex, menuOpen, runMenuItem]);

  const selectedModule = selectedModuleId 
    ? modules.find(m => m.id === selectedModuleId) 
    : null;

  const selectedSection = selectedSectionId && selectedModule
    ? selectedModule.sections.find(s => s.id === selectedSectionId)
    : null;

  const renderSectionBlocks = (content: string, blocks?: Module['sections'][number]['blocks']) => {
    if (blocks && blocks.length > 0) {
      return (
        <div className="space-y-3">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              {block.title && (
                <div className="text-xs uppercase tracking-widest text-cyan-400/70 mb-2">{block.title}</div>
              )}
              {block.type === 'code' ? (
                <pre className="text-xs text-cyan-200 bg-black/60 rounded-md p-3 overflow-x-auto">
                  <code>{block.content}</code>
                </pre>
              ) : (
                <div className="text-white/80 text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {block.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  };

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
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Sessions
              </div>
              <button
                type="button"
                onClick={handleNewSession}
                className="px-2 py-1 text-[10px] font-mono text-cyan-300 border border-cyan-500/20 rounded hover:bg-cyan-500/10 transition-colors"
              >
                + New
              </button>
            </div>
            <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar">
              {sessions.length === 0 ? (
                <div className="text-xs text-white/40">No sessions yet.</div>
              ) : (
                [...sessions]
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((session) => {
                    const label = getSessionLabel(session);
                    const isActive = session.id === currentSessionId;
                    return (
                      <div
                        key={session.id}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors ${isActive ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200' : 'border-white/5 bg-white/[0.02] text-white/70 hover:border-cyan-500/20 hover:bg-white/[0.04]'}`}
                      >
                        <button
                          type="button"
                          onClick={() => switchSession(session.id)}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          <span className={`text-[9px] uppercase tracking-[0.2em] ${isActive ? 'text-cyan-300' : 'text-white/30'}`}>
                            {isActive ? 'Active' : 'Session'}
                          </span>
                          <span className="text-xs font-mono flex-1 truncate">{label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSession(session.id)}
                          className="text-white/30 hover:text-red-400 transition-colors"
                          aria-label={`Delete session ${label}`}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-3">
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
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {renderSectionBlocks(selectedSection.content, selectedSection.blocks)}
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
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
                <span>
                  Session: <span className="text-cyan-400">{currentSessionName}</span>
                </span>
                <span className="text-white/20">Type / for menu</span>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const trimmed = inputValue.trim();
                if (!trimmed) return;
                if (menuOpen && menuItems.length > 0) {
                  const selected = menuItems[menuIndex];
                  if (!selected) return;
                  setInputValue('');
                  setMenuOpen(false);
                  runMenuItem(selected);
                  return;
                }
                handleCommand(trimmed);
                setInputValue('');
                setMenuOpen(false);
              }}>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-500 shrink-0">❯</span>
                  <input
                    type="text"
                    id="curriculum-command"
                    name="curriculumCommand"
                    aria-label="Curriculum command"
                    aria-expanded={menuOpen}
                    aria-controls={menuOpen ? 'curriculum-command-menu' : undefined}
                    aria-autocomplete="list"
                    aria-activedescendant={menuOpen && menuItems.length > 0 ? `command-option-${menuIndex}` : undefined}
                    placeholder="Type command (or click items above)..."
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-cyan-400 placeholder:text-white/20 font-mono text-base md:text-sm"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </form>
              {menuOpen && (
                <div className="mt-2 rounded-lg border border-cyan-500/20 bg-[#0c1116]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-400/70 border-b border-cyan-500/10">
                    Command Menu
                  </div>
                  <ul
                    id="curriculum-command-menu"
                    role="listbox"
                    className="max-h-56 overflow-y-auto custom-scrollbar"
                  >
                    {menuItems.length === 0 ? (
                      <li className="px-3 py-3 text-xs text-white/40">
                        No matching results.
                      </li>
                    ) : (
                      menuItems.map((item, idx) => (
                        <li
                          key={item.id}
                          id={`command-option-${idx}`}
                          role="option"
                          aria-selected={menuIndex === idx}
                          onMouseEnter={() => setMenuIndex(idx)}
                          onClick={() => {
                            setMenuOpen(false);
                            setInputValue('');
                            runMenuItem(item);
                          }}
                          className={`px-3 py-2 cursor-pointer border-l-2 ${menuIndex === idx ? 'border-cyan-400 bg-cyan-500/15' : 'border-transparent hover:bg-white/5'} transition-colors`}
                        >
                          <div className="flex items-center gap-2 text-xs font-mono">
                            {item.kind === 'command' ? (
                              <>
                                <span className="text-cyan-400">/</span>
                                <span className="text-cyan-200">{item.label}</span>
                                <span className="text-white/30">{item.usage}</span>
                              </>
                            ) : item.kind === 'session' ? (
                              <>
                                <span className="text-emerald-400">●</span>
                                <span className="text-emerald-200">{item.label}</span>
                                <span className="text-white/30">session</span>
                              </>
                            ) : (
                              <>
                                <span className="text-cyan-400">+</span>
                                <span className="text-cyan-200">{item.label}</span>
                                <span className="text-white/30">action</span>
                              </>
                            )}
                          </div>
                          <div className="text-[11px] text-white/50 mt-0.5">
                            {item.description}
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="px-3 py-2 border-t border-white/5 text-[10px] text-white/30">
                    Use ↑/↓ to select, Enter to run, Esc to close
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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

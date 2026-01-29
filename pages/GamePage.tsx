import { useMemo, useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useCurriculumStore } from '../stores/useCurriculumStore';
import { useAcademyStore } from '../stores';
import type { TerminalLine as TerminalLineType } from '../hooks/useTerminal';
import type { Module } from '../types/curriculum';

type SessionViewMode = 'list' | 'module' | 'section' | 'time';

interface CommandSession {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  lines: TerminalLineType[];
  viewMode: SessionViewMode;
  selectedModuleId: string | null;
  selectedSectionId: string | null;
  commandHistory: string[];
}

interface SuggestionItem {
  id: string;
  label: string;
  description: string;
  kind: 'command' | 'session' | 'module';
  value: string;
}

const SESSION_STORAGE_KEY = 'vibe-curriculum-sessions';
const MAX_SESSION_NAME_LENGTH = 40;

const normalizePrompt = (value: string): string => value.replace(/^>\s?/, '').trim();

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

const getFirstPrompt = (lines: CommandSession['lines']): string => {
  const firstInput = lines.find((line) => line.type === 'input' && line.text.trim());
  return firstInput ? normalizePrompt(firstInput.text) : '';
};

const buildSystemLines = (lines: string[]): TerminalLineType[] => (
  lines.map((line) => ({
    text: `APEX OS> ${line}`,
    type: 'system',
  }))
);

const COMMAND_DEFINITIONS = [
  { name: 'new', usage: '/new', description: 'Start a new session' },
  { name: 'open', usage: '/open <module|id>', description: 'Open module details' },
  { name: 'terminal', usage: '/terminal <module>', description: 'Launch Academy terminal' },
  { name: 'resume', usage: '/resume <session>', description: 'Switch to a saved session' },
  { name: 'sessions', usage: '/sessions', description: 'View sessions' },
  { name: 'modules', usage: '/modules', description: 'View modules' },
  { name: 'feed', usage: '/feed', description: 'View feed' },
  { name: 'delete', usage: '/delete <session>', description: 'Delete a session' },
  { name: 'help', usage: '/help', description: 'Show this help message' },
];

const deriveCommandHistory = (lines: TerminalLineType[]): string[] => (
  lines
    .filter((line) => line.type === 'input')
    .map((line) => normalizePrompt(line.text))
    .filter((text) => text.length > 0)
);

const parseSessions = (): CommandSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((session: unknown): session is CommandSession => Boolean(session && typeof session === 'object'))
      .map((session) => {
        const rawSession = session as Partial<CommandSession>;
        const lines = Array.isArray(rawSession.lines) ? rawSession.lines : [];
        return {
          id: String(rawSession.id ?? ''),
          name: String(rawSession.name ?? 'New Session'),
          createdAt: Number(rawSession.createdAt ?? Date.now()),
          updatedAt: Number(rawSession.updatedAt ?? Date.now()),
          lines,
          viewMode: (rawSession.viewMode as SessionViewMode) ?? 'list',
          selectedModuleId: rawSession.selectedModuleId ?? null,
          selectedSectionId: rawSession.selectedSectionId ?? null,
          commandHistory: Array.isArray(rawSession.commandHistory)
            ? rawSession.commandHistory
            : deriveCommandHistory(lines),
        };
      })
      .filter((session) => session.id.length > 0);
  } catch {
    return [];
  }
};

const saveSessions = (sessions: CommandSession[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    return;
  }
};

const getRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const findModuleTag = (history: string[], modules: Module[]): string => {
  const reversed = [...history].reverse();
  const match = reversed.find((entry) => entry.startsWith('mount '));
  if (!match) return 'GENERAL';
  const number = match.replace('mount', '').trim().padStart(2, '0');
  const module = modules.find((item) => item.number === number);
  return module ? `PHASE ${module.number}` : 'GENERAL';
};

const findModuleLabel = (history: string[], modules: Module[]): string | null => {
  const reversed = [...history].reverse();
  const match = reversed.find((entry) => entry.startsWith('mount '));
  if (!match) return null;
  const number = match.replace('mount', '').trim().padStart(2, '0');
  const module = modules.find((item) => item.number === number);
  return module ? module.title : null;
};

export function GamePage() {
  const navigate = useNavigate();
  const { setView, selectModule } = useAcademyStore();
  const { modules, loadModules } = useCurriculumStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'feed' | 'modules' | 'sessions'>('feed');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const commandRef = useRef<HTMLInputElement>(null);
  const [sessions, setSessions] = useState<CommandSession[]>(() => parseSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    loadModules().catch(() => undefined);
  }, [loadModules]);

  useEffect(() => {
    setSessions(parseSessions());
  }, []);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      setActiveSessionId(sessions[0]?.id ?? null);
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isEditable) return;
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setCommandOpen(true);
        setCommandInput('/');
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!commandOpen) return;
    const timer = setTimeout(() => {
      try {
        commandRef.current?.focus();
      } catch (error) {
        console.warn('Focus error:', error);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [commandOpen]);

  const filteredModules = useMemo(() => {
    if (!search.trim()) return modules;
    const query = search.toLowerCase();
    return modules.filter((module) => (
      module.title.toLowerCase().includes(query)
      || module.subtitle.toLowerCase().includes(query)
      || module.objective.toLowerCase().includes(query)
      || module.number.toLowerCase().includes(query)
    ));
  }, [modules, search]);

  const activeSessions = useMemo(() => (
    [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)
  ), [sessions]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [activeSessionId, sessions]
  );

  const commandQuery = useMemo(() => (
    commandInput.replace(/^\//, '').trim().toLowerCase()
  ), [commandInput]);

  const suggestionGroups = useMemo(() => {
    const matches = (value: string) => value.toLowerCase().includes(commandQuery);

    const commandItems: SuggestionItem[] = COMMAND_DEFINITIONS
      .filter((cmd) => !commandQuery || matches(cmd.name) || matches(cmd.usage) || matches(cmd.description))
      .map((cmd) => ({
        id: `command-${cmd.name}`,
        label: cmd.usage,
        description: cmd.description,
        kind: 'command',
        value: cmd.name,
      }));

    const sessionItems: SuggestionItem[] = activeSessions
      .filter((session) => {
        if (!commandQuery) return true;
        const label = session.name === 'New Session'
          ? formatSessionName(getFirstPrompt(session.lines))
          : session.name;
        return matches(label);
      })
      .slice(0, 6)
      .map((session) => ({
        id: `session-${session.id}`,
        label: session.name === 'New Session'
          ? formatSessionName(getFirstPrompt(session.lines))
          : session.name,
        description: 'Resume session',
        kind: 'session',
        value: session.id,
      }));

    const moduleItems: SuggestionItem[] = modules
      .filter((module) => !commandQuery || matches(module.title) || matches(module.subtitle) || matches(module.number))
      .slice(0, 6)
      .map((module) => ({
        id: `module-${module.id}`,
        label: `PHASE ${module.number} — ${module.title}`,
        description: 'Open module',
        kind: 'module',
        value: module.number,
      }));

    return [
      { label: 'Commands', items: commandItems },
      { label: 'Sessions', items: sessionItems },
      { label: 'Modules', items: moduleItems },
    ].filter((group) => group.items.length > 0);
  }, [activeSessions, commandQuery, modules]);

  const flatSuggestions = useMemo(() => (
    suggestionGroups.flatMap((group) => group.items)
  ), [suggestionGroups]);

  useEffect(() => {
    setSuggestionIndex(0);
  }, [commandQuery, flatSuggestions.length]);

  const ensureActiveSession = useCallback((): string => {
    if (activeSessionId && sessions.some((session) => session.id === activeSessionId)) {
      return activeSessionId;
    }
    if (sessions.length > 0) {
      const fallbackId = sessions[0]?.id ?? '';
      if (fallbackId) setActiveSessionId(fallbackId);
      return fallbackId;
    }
    const now = Date.now();
    const newSession: CommandSession = {
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
    setSessions([newSession]);
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, [activeSessionId, sessions]);

  const updateSession = useCallback((sessionId: string, updater: (session: CommandSession) => CommandSession) => {
    setSessions((prev) => prev.map((session) => (
      session.id === sessionId ? updater(session) : session
    )));
  }, []);

  const appendSessionLines = useCallback((sessionId: string, lines: TerminalLineType[]) => {
    updateSession(sessionId, (session) => ({
      ...session,
      lines: [...session.lines, ...lines],
      updatedAt: Date.now(),
    }));
  }, [updateSession]);

  const appendCommandHistory = useCallback((sessionId: string, command: string) => {
    updateSession(sessionId, (session) => {
      const nextHistory = [...session.commandHistory.slice(-49), command];
      const nextName = session.name === 'New Session'
        ? formatSessionName(command)
        : session.name;
      return {
        ...session,
        name: nextName,
        commandHistory: nextHistory,
        updatedAt: Date.now(),
      };
    });
  }, [updateSession]);

  const handleNewSession = useCallback((): string => {
    const now = Date.now();
    const newSession: CommandSession = {
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
    const next = [newSession, ...sessions];
    setSessions(next);
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, [sessions]);

  const openModule = useCallback((module: Module) => {
    setSelectedModule(module);
    if (activeSessionId) {
      updateSession(activeSessionId, (session) => ({
        ...session,
        selectedModuleId: module.id,
        viewMode: 'module',
        updatedAt: Date.now(),
      }));
    }
  }, [activeSessionId, updateSession]);

  const handleOpenInTerminal = useCallback((moduleId: string) => {
    setView('terminal');
    selectModule(moduleId);
    navigate('/academy');
  }, [navigate, selectModule, setView]);

  const resolveModule = useCallback((query: string): Module | null => {
    const normalized = query.toLowerCase();
    return modules.find((item) => (
      item.number.toLowerCase() === normalized
      || item.id.toLowerCase() === normalized
      || item.title.toLowerCase().includes(normalized)
    )) ?? null;
  }, [modules]);

  const resolveSession = useCallback((query: string): CommandSession | null => {
    const normalized = query.toLowerCase();
    return sessions.find((session) => {
      const label = session.name === 'New Session'
        ? formatSessionName(getFirstPrompt(session.lines))
        : session.name;
      return label.toLowerCase().includes(normalized) || session.id.toLowerCase() === normalized;
    }) ?? null;
  }, [sessions]);

  const handleCommandSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const normalized = trimmed.startsWith('/') ? trimmed.slice(1).trim() : trimmed;
    if (!normalized) return;

    const [rawCommand = '', ...rest] = normalized.split(/\s+/);
    const command = rawCommand.toLowerCase();
    const argument = rest.join(' ').trim();

    let sessionId = ensureActiveSession();

    if (command === 'new') {
      sessionId = handleNewSession();
    } else if (command === 'resume' && argument) {
      const target = resolveSession(argument);
      if (target) {
        sessionId = target.id;
        setActiveSessionId(target.id);
      }
    }

    const inputLine: TerminalLineType = {
      text: `> /${normalized}`,
      type: 'input',
    };

    appendSessionLines(sessionId, [inputLine]);
    appendCommandHistory(sessionId, normalized);

    const output: TerminalLineType[] = [];

    switch (command) {
      case 'new':
        output.push(...buildSystemLines([
          'APEX_SESSION_CREATED',
          'INITIALIZING COMMAND CENTER...',
          'READY.',
        ]));
        break;
      case 'open':
        if (!argument) {
          output.push({
            text: 'APEX OS> ERROR: /open requires a module id.',
            type: 'error',
          });
          break;
        }
        {
          const module = resolveModule(argument);
          if (!module) {
            output.push({
              text: `APEX OS> ERROR: Module "${argument}" not found.`,
              type: 'error',
            });
          } else {
            setSelectedModule(module);
            setActiveFilter('modules');
            updateSession(sessionId, (session) => ({
              ...session,
              selectedModuleId: module.id,
              viewMode: 'module',
              updatedAt: Date.now(),
            }));
            output.push(...buildSystemLines([
              `MODULE_SELECTED: PHASE ${module.number} — ${module.title}`,
              'STATUS: READY',
            ]));
          }
        }
        break;
      case 'terminal':
        if (!argument) {
          output.push({
            text: 'APEX OS> ERROR: /terminal requires a module id.',
            type: 'error',
          });
          break;
        }
        {
          const module = resolveModule(argument);
          if (!module) {
            output.push({
              text: `APEX OS> ERROR: Module "${argument}" not found.`,
              type: 'error',
            });
          } else {
            output.push(...buildSystemLines([
              'LAUNCHING TERMINAL...',
              'ROUTING TO ACADEMY',
            ]));
            handleOpenInTerminal(module.id);
          }
        }
        break;
      case 'resume':
        if (!argument) {
          output.push({
            text: 'APEX OS> ERROR: /resume requires a session name.',
            type: 'error',
          });
          break;
        }
        {
          const target = resolveSession(argument);
          if (!target) {
            output.push({
              text: `APEX OS> ERROR: Session "${argument}" not found.`,
              type: 'error',
            });
          } else {
            setActiveSessionId(target.id);
            output.push(...buildSystemLines([
              `SESSION_RESUMED: ${target.name === 'New Session' ? formatSessionName(getFirstPrompt(target.lines)) : target.name}`,
            ]));
          }
        }
        break;
      case 'delete':
        if (!argument) {
          output.push({
            text: 'APEX OS> ERROR: /delete requires a session name.',
            type: 'error',
          });
          break;
        }
        {
          const target = resolveSession(argument);
          if (!target) {
            output.push({
              text: `APEX OS> ERROR: Session "${argument}" not found.`,
              type: 'error',
            });
            break;
          }
          if (target.id === activeSessionId) {
            const now = Date.now();
            const replacement: CommandSession = {
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
            sessionId = replacement.id;
            setActiveSessionId(replacement.id);
            setSessions((prev) => [replacement, ...prev.filter((session) => session.id !== target.id)]);
          } else {
            setSessions((prev) => prev.filter((session) => session.id !== target.id));
          }
          output.push(...buildSystemLines([
            `SESSION_DELETED: ${target.name === 'New Session' ? formatSessionName(getFirstPrompt(target.lines)) : target.name}`,
          ]));
        }
        break;
      case 'sessions':
        setActiveFilter('sessions');
        updateSession(sessionId, (session) => ({
          ...session,
          viewMode: 'list',
          updatedAt: Date.now(),
        }));
        output.push(...buildSystemLines(['VIEW: SESSIONS']));
        break;
      case 'modules':
        setActiveFilter('modules');
        updateSession(sessionId, (session) => ({
          ...session,
          viewMode: 'module',
          updatedAt: Date.now(),
        }));
        output.push(...buildSystemLines(['VIEW: MODULES']));
        break;
      case 'feed':
        setActiveFilter('feed');
        updateSession(sessionId, (session) => ({
          ...session,
          viewMode: 'list',
          updatedAt: Date.now(),
        }));
        output.push(...buildSystemLines(['VIEW: FEED']));
        break;
      case 'help':
        output.push(...buildSystemLines([
          'COMMANDS',
          '╔══════════════════════════════════════════════╗',
          '║ /new                 Start a new session     ║',
          '║ /open <module|id>     Open module details    ║',
          '║ /terminal <module>    Launch Academy terminal║',
          '║ /resume <session>     Switch session         ║',
          '║ /sessions             View sessions          ║',
          '║ /modules              View modules           ║',
          '║ /feed                 View feed              ║',
          '║ /delete <session>     Delete session         ║',
          '║ /help                 Show this help         ║',
          '╚══════════════════════════════════════════════╝',
        ]));
        break;
      default:
        output.push({
          text: `APEX OS> ERROR: Unknown command "${command}". Type /help for available commands.`,
          type: 'error',
        });
    }

    if (output.length > 0) {
      appendSessionLines(sessionId, output);
    }
  }, [appendCommandHistory, appendSessionLines, ensureActiveSession, handleNewSession, handleOpenInTerminal, resolveModule, resolveSession, activeSessionId, modules, updateSession]);

  const handleCommandKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestionsOpen = commandInput.trim().startsWith('/') && flatSuggestions.length > 0;
    if (suggestionsOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSuggestionIndex((index) => (index + 1) % flatSuggestions.length);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSuggestionIndex((index) => (index - 1 + flatSuggestions.length) % flatSuggestions.length);
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const selected = flatSuggestions[suggestionIndex];
        if (!selected) return;
        if (selected.kind === 'command') {
          handleCommandSubmit(`/${selected.value}`);
        } else if (selected.kind === 'session') {
          handleCommandSubmit(`/resume ${selected.value}`);
        } else {
          handleCommandSubmit(`/open ${selected.value}`);
        }
        setCommandInput('');
        setCommandOpen(false);
        return;
      }
    }

    if (event.key === 'Escape') {
      setCommandOpen(false);
    }
  }, [commandInput, flatSuggestions, handleCommandSubmit, suggestionIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06080d] via-[#0b1118] to-[#07101b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0e1624,transparent_50%),radial-gradient(circle_at_bottom,#0a1c2e,transparent_40%)] opacity-80" />
      <div className="relative z-10">
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-6 py-6 border-b border-white/10 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400/80 font-mono">Vibe Academy</p>
            <h1 className="text-2xl sm:text-3xl font-bold">Command Center</h1>
            <p className="text-white/50 text-sm">Manage sessions, explore modules, ship faster.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg">
              <Search className="w-4 h-4 text-white/40" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search modules, sessions..."
                className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-full lg:w-56"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['feed', 'modules', 'sessions'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveFilter(item)}
                  className={`px-3 py-2 text-xs uppercase tracking-[0.3em] border rounded-lg transition ${activeFilter === item ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-200' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6 px-6 py-6">
          <aside className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Sessions</p>
              <button
                onClick={handleNewSession}
                className="text-xs font-mono text-cyan-300 border border-cyan-500/30 px-2 py-1 rounded"
              >
                + New
              </button>
            </div>
            <div className="space-y-2 max-h-[520px] overflow-y-auto custom-scrollbar">
              {activeSessions.length === 0 && (
                <div className="text-xs text-white/40">No sessions yet.</div>
              )}
              {activeSessions.map((session) => {
                const label = session.name === 'New Session'
                  ? formatSessionName(getFirstPrompt(session.lines))
                  : session.name;
                const tag = findModuleTag(session.commandHistory, modules);
                const moduleLabel = findModuleLabel(session.commandHistory, modules);
                const isActive = session.id === activeSessionId;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      if (session.selectedModuleId) {
                        const module = modules.find((item) => item.id === session.selectedModuleId) ?? null;
                        setSelectedModule(module);
                      } else {
                        setSelectedModule(null);
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
                      <span>{tag}</span>
                      <span>{getRelativeTime(session.updatedAt)}</span>
                    </div>
                    <div className="text-sm font-mono text-white/80 mt-2 truncate">{label}</div>
                    {moduleLabel && (
                      <div className="text-[11px] text-white/40 mt-2 truncate">{moduleLabel}</div>
                    )}
                    {isActive && (
                      <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-cyan-300">
                        Active
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Modules</h2>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Filter className="w-4 h-4" />
                {activeFilter.toUpperCase()} VIEW
              </div>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(activeFilter === 'feed' || activeFilter === 'sessions') && activeSessions.slice(0, 6).map((session) => {
                const label = session.name === 'New Session'
                  ? formatSessionName(getFirstPrompt(session.lines))
                  : session.name;
                const tag = findModuleTag(session.commandHistory, modules);
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      if (session.selectedModuleId) {
                        const module = modules.find((item) => item.id === session.selectedModuleId) ?? null;
                        setSelectedModule(module);
                      } else {
                        setSelectedModule(null);
                      }
                      setActiveFilter('sessions');
                    }}
                    className="text-left p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition group"
                  >
                    <div className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">{tag}</div>
                    <div className="text-base font-semibold text-white mt-2 group-hover:text-emerald-200 transition-colors">
                      {label}
                    </div>
                    <div className="text-xs text-white/50 mt-2 line-clamp-2">{getRelativeTime(session.updatedAt)}</div>
                    <div className="flex items-center justify-between text-[11px] text-white/40 mt-4">
                      <span>{session.commandHistory.length} commands</span>
                      <span>Session</span>
                    </div>
                  </button>
                );
              })}
              {activeFilter !== 'sessions' && filteredModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => openModule(module)}
                  className="text-left p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.06] transition group"
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-cyan-400/70">Phase {module.number}</div>
                  <div className="text-base font-semibold text-white mt-2 group-hover:text-cyan-200 transition-colors">
                    {module.title}
                  </div>
                  <div className="text-xs text-white/50 mt-2 line-clamp-2">{module.subtitle}</div>
                  <div className="flex items-center justify-between text-[11px] text-white/40 mt-4">
                    <span>{module.duration}</span>
                    <span>{module.sections.length} sections</span>
                  </div>
                </button>
              ))}
            </div>
          </main>

          <aside className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-white/40">Module Detail</div>
              {selectedModule ? (
                <div className="mt-4 space-y-3">
                  <div className="text-cyan-400 text-xs uppercase tracking-[0.3em]">Phase {selectedModule.number}</div>
                  <div className="text-lg font-semibold text-white">{selectedModule.title}</div>
                  <p className="text-sm text-white/60">{selectedModule.objective}</p>
                  <button
                    onClick={() => handleOpenInTerminal(selectedModule.id)}
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/20 transition"
                  >
                    Open in terminal
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : activeFilter === 'sessions' && activeSession ? (
                <div className="mt-4 space-y-3">
                  <div className="text-emerald-400 text-xs uppercase tracking-[0.3em]">Active Session</div>
                  <div className="text-lg font-semibold text-white">
                    {activeSession.name === 'New Session'
                      ? formatSessionName(getFirstPrompt(activeSession.lines))
                      : activeSession.name}
                  </div>
                  <div className="text-sm text-white/60">
                    {activeSession.commandHistory.slice(-3).map((entry, idx) => (
                      <div key={idx} className="font-mono text-xs text-white/50 truncate">
                        &gt; {entry}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveFilter('sessions')}
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/20 transition"
                  >
                    Resume session
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-white/40 mt-3">Select a module or session to preview details.</p>
              )}
            </div>
          </aside>
        </div>

        {commandOpen && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(720px,90vw)] bg-black/70 border border-cyan-500/30 rounded-xl backdrop-blur-lg px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70 mb-2">APEX OS Command Strip</div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleCommandSubmit(commandInput);
                setCommandInput('');
                setCommandOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <span className="text-cyan-400 font-mono">/</span>
              <input
                ref={commandRef}
                value={commandInput}
                onChange={(event) => setCommandInput(event.target.value)}
                onKeyDown={handleCommandKeyDown}
                placeholder="/new, /open 01, /terminal 02, /help"
                className="flex-1 bg-transparent text-white/80 font-mono text-sm outline-none placeholder:text-white/30"
              />
              <button className="text-xs text-cyan-200 border border-cyan-500/30 px-3 py-1 rounded">Run</button>
            </form>
            {commandInput.trim().startsWith('/') && suggestionGroups.length > 0 && (
              <div className="mt-3 rounded-lg border border-cyan-500/20 bg-black/60">
                {suggestionGroups.map((group) => (
                  <div key={group.label} className="border-t border-white/5 first:border-t-0">
                    <div className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/30">
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const index = flatSuggestions.findIndex((entry) => entry.id === item.id);
                      const isActive = index === suggestionIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setSuggestionIndex(index)}
                          onClick={() => {
                            if (item.kind === 'command') {
                              handleCommandSubmit(`/${item.value}`);
                            } else if (item.kind === 'session') {
                              handleCommandSubmit(`/resume ${item.value}`);
                            } else {
                              handleCommandSubmit(`/open ${item.value}`);
                            }
                            setCommandInput('');
                            setCommandOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-mono transition ${isActive ? 'bg-cyan-500/15 text-cyan-100' : 'text-white/70 hover:bg-white/5'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            <span className="text-white/40">{item.kind}</span>
                          </div>
                          <div className="text-[11px] text-white/40">{item.description}</div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 text-[11px] text-white/40">Press Esc to close</div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Sparkles, Zap, Activity, Shield, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { useMatrixStore } from '@/stores/useMatrixStore';
import { useGameEngine } from '@/stores/useGameEngine';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { useSession, type SessionState } from '@/hooks/useSession';
import { MAIN_QUESTS } from '@/data/questsData';
import * as CLIFormatter from '@/lib/cliFormatter';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX TERMINAL HUD v1.2.0 — The Sovereign Developer Interface
// ═══════════════════════════════════════════════════════════════════════════════

const APEX_LOGO_ASCII = `
  █████╗ ██████╗ ███████╗██╗  ██╗    ██████╗  ███████╗
 ██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝   ██╔═══██╗██╔════╝ 
 ███████║██████╔╝█████╗   ╚███╔╝    ██║   ██║███████╗ 
 ██╔══██║██╔═══╝ ██╔══╝   ██╔██╗    ██║   ██║╚════██║ 
 ██║  ██║██║     ███████╗██╔╝ ██╗   ╚██████╔╝███████║ 
 ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝ 
`;

const PLAYER_ONE_ASCII = `
 ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗      ██╗
 ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗    ███║
 ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ╚██║
 ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗     ██║
 ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║     ██║
 ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝     ╚═╝
`;

const TerminalCodeBlock = ({ children, language }: { children: string; language?: string }) => (
  <div className="my-4 rounded-lg border border-emerald-500/30 bg-black/40 backdrop-blur-sm overflow-hidden">
    <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
        <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
      </div>
      <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider">
        {language || 'code'}
      </span>
    </div>
    <pre className="p-3 overflow-x-auto">
      <code className="text-emerald-300 font-mono text-xs leading-relaxed">{children}</code>
    </pre>
  </div>
);

interface ApexTerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'ai' | 'branding';
  content: string | React.ReactNode;
  timestamp: Date;
}

const COMMANDS = [
  'help', 'clear', 'vibe', 'ask', 'code', 'explain', 'debug',
  'status', 'inventory', 'quests', 'map', 'cd', 'ls', 'pwd',
  'fork', 'solve', 'submit', 'abandon',
  'ingest', 'recall', 'sources', 'forget', 'stats'
];

const HELP_TEXT = `
┌─────────────────────────────────────────────────────────────┐
│  APEX OS — CLI Commands                                     │
├─────────────────────────────────────────────────────────────┤
│  AI ASSISTANCE                                              │
│    ask <question>    Ask AI anything                        │
│    code <desc>       Generate code                          │
│    explain <topic>   Get explanation                        │
│    debug <error>     Debug help                             │
│                                                             │
│  NAVIGATION                                                 │
│    cd <node-id>      Navigate to node                       │
│    ls               List adjacent nodes                     │
│    pwd              Show current position                   │
│    map              Display ASCII map                       │
│                                                             │
│  PLAYER STATUS                                              │
│    status           Show XP, level, stats                   │
│    inventory        List unlocked skills                    │
│    quests           Show available quests                   │
│                                                             │
│  CHALLENGES                                                 │
│    solve            Start current node challenge            │
│    submit <code>    Submit solution                         │
│    abandon          Cancel current challenge                │
│                                                             │
│  DECISION POINTS                                            │
│    fork status      Show available paths                    │
│    fork choose <n>  Select path at fork                     │
│    fork preview <n> Preview path outcome                    │
│                                                             │
│  KNOWLEDGE BASE                                             │
│    ingest <url>         Ingest URL into knowledge base      │
│    ingest --yt <id>     Ingest YouTube transcript           │
│    ingest --gh <repo>   Ingest GitHub repo                  │
│    ingest --notion <id> Ingest Notion page                  │
│    recall <query>       Search your knowledge base          │
│    sources              List all ingested sources           │
│    forget <id>          Remove a source                     │
│    stats                RLM learning statistics             │
│                                                             │
│  UTILITIES                                                  │
│    help             Show this menu                          │
│    clear            Clear terminal                          │
│    vibe             Random wisdom                           │
└─────────────────────────────────────────────────────────────┘`;

const VIBE_QUOTES = [
  "The vibe coder doesn't fight the current - they become the current.",
  "Speed is a feature. Ship fast, learn faster.",
  "The best code is the code you don't write.",
  "In the age of AI, taste becomes the ultimate skill.",
  "We don't write code anymore. We conduct symphonies of intent.",
  "Perfect is the enemy of deployed.",
  "You're not learning to code - you're learning to shape reality.",
];

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- NEW PREMIUM NEURAL PIXEL BRANDING (ACCESSIBILITY OPTIMIZED) ---
const NeuralPixelBranding = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAuthorized(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 8x8 Symmetrical Grid for the "Chessboard" Effect
  const grid = Array.from({ length: 64 }, (_, i) => i);

  return (
    <div className="py-8 font-mono text-[8px] sm:text-[10px] leading-none opacity-90">
      {/* APEX OS SECTION */}
      <div className="mb-12 space-y-0.5">
        {APEX_LOGO_ASCII.split('\n').map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-2" />;
          return (
            <div key={i} className="whitespace-pre text-cyan-400/90 boot-glitch">
              {line}
            </div>
          );
        })}
      </div>
      
      {/* PLAYER 1 SECTION - Premium Neural Grid */}
      <div className="relative mb-12 ml-4">
        <motion.div 
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative inline-block"
        >
          {/* Symmetrical Chessboard Pixel Art Effect */}
          <div className="absolute inset-0 bg-cyan-500/5 blur-3xl -z-10" />
          
          <div className="flex items-center gap-8 p-6 bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-sm shadow-2xl">
            {/* The Neural Chessboard */}
            <div className="grid grid-cols-8 gap-1 opacity-30">
              {grid.map((i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isBlack = (row + col) % 2 === 1;
                return (
                  <motion.div
                    key={i}
                    animate={!isAuthorized && isBlack ? { opacity: [0.1, 0.4, 0.1] } : { opacity: 0.1 }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      delay: i * 0.02,
                      ease: "easeInOut" 
                    }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm ${isBlack ? 'bg-cyan-400' : 'bg-white/10'}`}
                  />
                );
              })}
            </div>

            {/* Inverted Player 1 Badge */}
            <div className="flex flex-col gap-2">
              <div className={`px-4 py-2 transition-all duration-1000 rounded-lg text-center overflow-hidden ${isAuthorized ? 'player-authorized' : 'player-select-flicker'}`}>
                <pre className="font-mono text-[6px] sm:text-[8px] md:text-[10px] leading-none font-black inline-block whitespace-pre">
                  {PLAYER_ONE_ASCII}
                </pre>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isAuthorized ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'}`} />
                <span className={`text-[9px] uppercase tracking-[0.3em] font-bold ${isAuthorized ? 'text-emerald-400/80' : 'text-cyan-400/40'}`}>
                  {isAuthorized ? 'Handshake_Authorized' : 'Syncing_Synapses...'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Telemetry Bar */}
      <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 opacity-50" />
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-0.5">Operator</p>
              <p className="text-white font-bold tracking-tight text-sm">PLAYER ONE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-0.5">Credits</p>
              <p className="text-emerald-400 font-bold tracking-tight text-sm">$300_LOADED</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-0.5">Intelligence</p>
              <p className="text-white font-bold tracking-tight text-sm">G3_FLASH_PREV</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-0.5">Security</p>
              <p className="text-purple-400 font-bold tracking-tight text-sm">[ SOVEREIGN ]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ApexTerminalHUD: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [lines, setLines] = useState<ApexTerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [terminalSize, setTerminalSize] = useState({ width: 0, height: 0 });
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  
  const { syncTerminalContext, processDirectorResponse, nodes, edges } = useMatrixStore();
  const gameEngine = useGameEngine();
  const skillTree = useSkillTreeStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const latestSessionRef = useRef<Partial<SessionState<ApexTerminalLine>>>({});

  const { loadState, saveState, clearSession, setupAutoSave } = useSession<ApexTerminalLine>({
    terminalId: 'apex-os-terminal',
    autoSaveInterval: 4000,
  });

  useEffect(() => {
    const restored = loadState();
    if (!restored) return;

    const restoredLines = Array.isArray(restored.lines)
      ? (restored.lines as ApexTerminalLine[])
      : [];
    const normalizedLines = restoredLines
      .filter((line) => line && typeof line.content === 'string')
      .map((line) => ({
        ...line,
        content: line.content as string,
        timestamp: line.timestamp ? new Date(line.timestamp) : new Date(),
      }));

    setLines(normalizedLines);
    setCommandHistory(restored.history ?? []);
    setInput(restored.inputValue ?? '');
    setHistoryIndex(-1);
    setIsBooting(false);
    setHasRestoredSession(true);

    const scrollPosition = restored.scrollPosition;
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = scrollPosition ?? 0;
      }
    }, 50);
  }, [loadState]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RESIZE OBSERVER FOR RESPONSIVE TERMINAL
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const serializableLines = lines
      .filter((line) => typeof line.content === 'string')
      .map((line) => ({
        ...line,
        content: line.content as string,
      }));

    latestSessionRef.current = {
      lines: serializableLines,
      history: commandHistory,
      inputValue: input,
      scrollPosition: outputRef.current?.scrollTop ?? 0,
    };
  }, [lines, commandHistory, input]);

  useEffect(() => {
    return setupAutoSave(() => latestSessionRef.current);
  }, [setupAutoSave]);

  useEffect(() => {
    return () => {
      try {
        saveState(latestSessionRef.current);
      } catch (error) {
        console.warn('Failed to persist terminal session on unmount:', error);
      }
    };
  }, [saveState]);

  useEffect(() => {
    if (!terminalRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setTerminalSize({ width, height });
        
        // Trigger terminal refit - scroll to bottom after resize
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }
    });
    
    resizeObserver.observe(terminalRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const addLine = useCallback((type: ApexTerminalLine['type'], content: ApexTerminalLine['content']) => {
    const newLine: ApexTerminalLine = {
      id: generateId(),
      type,
      content,
      timestamp: new Date(),
    };
    setLines(prev => [...prev, newLine]);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // THE BOOT SEQUENCE
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (hasRestoredSession) return;

    const boot = async () => {
      setIsBooting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      addLine('branding', <NeuralPixelBranding />);
      setIsBooting(false);
    };
    boot();
  }, [addLine, hasRestoredSession]);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const callAI = useCallback(async (message: string, retryCount = 0): Promise<string> => {
    try {
      const history = lines
        .filter(l => l.type === 'input' || l.type === 'ai')
        .slice(-10)
        .map(l => ({
          role: l.type === 'input' ? 'user' : 'assistant',
          content: typeof l.content === 'string' ? l.content.replace(/^> /, '') : '',
        }));

      const response = await fetch('/api/terminal-vertex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // If we get an error and haven't exhausted retries, try again
        if (retryCount < 2) {
          console.warn(`AI Handshake failed (attempt ${retryCount + 1}). Retrying in 1s...`);
          await new Promise(r => setTimeout(r, 1000));
          return callAI(message, retryCount + 1);
        }
        throw new Error(data.error || `HTTP_${response.status}`);
      }
      
      // SYNC WITH DIRECTOR
      syncTerminalContext(data.response || '');
      
      // Fire and forget director sync to avoid blocking UI if it's slow
      fetch('/api/matrix-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentGraph: { nodes, edges },
          terminalLog: data.response,
          userGoal: 'Achieve Sovereign Dominance'
        }),
      }).then(res => {
        if (res.ok) res.json().then(processDirectorResponse);
      }).catch(err => console.warn('Director sync failed:', err));

      return data.response || 'Neural handshake complete.';
    } catch (err: any) {
      if (retryCount < 2) {
        console.warn(`Connection failed (attempt ${retryCount + 1}). Retrying in 1s...`);
        await new Promise(r => setTimeout(r, 1000));
        return callAI(message, retryCount + 1);
      }
      return `✗ SYSTEM_ERROR: ${err.message || 'Link failed'}. Check console for details.`;
    }
  }, [lines, nodes, edges, syncTerminalContext, processDirectorResponse]);

  const processCommand = useCallback(async (inputCommand: string) => {
    const trimmedCmd = inputCommand.trim();
    if (!trimmedCmd) return;

    setCommandHistory(prev => [...prev.slice(-49), trimmedCmd]);
    setHistoryIndex(-1);
    addLine('input', `> ${trimmedCmd}`);

    const [command, ...args] = trimmedCmd.split(' ');
    const argument = args.join(' ');

    const cmd = command?.toLowerCase();

    switch (cmd) {
      // ========== UTILITY COMMANDS ==========
      case 'help':
        addLine('system', HELP_TEXT);
        break;

      case 'clear':
        setLines([]);
        setCommandHistory([]);
        setHistoryIndex(-1);
        setInput('');
        clearSession();
        break;

      case 'vibe':
        addLine('system', `\n  ✦ "${VIBE_QUOTES[Math.floor(Math.random() * VIBE_QUOTES.length)]}"\n`);
        break;

      // ========== AI COMMANDS ==========
      case 'ask':
      case 'code':
      case 'explain':
      case 'debug':
        if (!argument) {
          addLine('error', CLIFormatter.formatError(`Usage: ${command} <context>`, 1));
        } else {
          setIsProcessing(true);
          const prefix = cmd === 'code' ? 'Generate code for: ' : cmd === 'explain' ? 'Explain: ' : cmd === 'debug' ? 'Debug: ' : '';
          const res = await callAI(prefix + argument);
          setIsProcessing(false);
          // Convert AI markdown to CLI format
          addLine('system', CLIFormatter.convertMarkdownToCLI(res));
        }
        break;

      // ========== NAVIGATION COMMANDS ==========
      case 'cd':
        if (!argument) {
          addLine('error', CLIFormatter.formatError('Usage: cd <node-id>', 1));
        } else {
          const success = gameEngine.navigateTo(argument);
          if (success) {
            const node = gameEngine.getCurrentNode();
            addLine('system', CLIFormatter.formatSuccess(`Navigated to: ${node?.data.label || argument}`, 0));
          } else {
            addLine('error', CLIFormatter.formatError(`Failed to navigate to ${argument}. Node not found or not adjacent.`, 1));
          }
        }
        break;

      case 'ls':
        {
          const adjacentNodes = gameEngine.getAdjacentNodes();
          const formatted = adjacentNodes.map(n => ({
            id: n.id,
            label: n.data.label,
            type: n.data.type,
            status: n.data.status,
            distance: 1,
          }));
          addLine('system', CLIFormatter.formatNodeList(formatted));
        }
        break;

      case 'pwd':
        {
          const currentNode = gameEngine.getCurrentNode();
          const pathHistory = gameEngine.position.pathHistory;
          addLine('system', `Current Node: ${currentNode?.data.label || 'Unknown'} [${currentNode?.id}]\nPath: ${pathHistory.join(' → ')}\n[exit 0]`);
        }
        break;

      case 'map':
        {
          const currentNode = gameEngine.getCurrentNode();
          const adjacentNodes = gameEngine.getAdjacentNodes();
          const formatted = adjacentNodes.map(n => ({
            id: n.id,
            label: n.data.label,
          }));
          addLine('system', CLIFormatter.formatAsciiMap(currentNode?.data.label || 'Unknown', formatted));
        }
        break;

      // ========== PLAYER STATUS COMMANDS ==========
      case 'status':
        {
          const stats = gameEngine.getPlayerStats();
          addLine('system', CLIFormatter.formatPlayerStats(stats));
        }
        break;

      case 'inventory':
        {
          const skills = skillTree.unlockedSkills.map(skillId => {
            const progress = skillTree.getSkillProgress(skillId);
            return {
              id: skillId,
              name: skillId, // TODO: Map to skill names
              progress: progress?.progress || 0,
            };
          });
          addLine('system', CLIFormatter.formatSkillsList(skills));
        }
        break;

      case 'quests':
        {
          const availableQuests = skillTree.getAvailableQuests();
          const activeQuest = skillTree.getActiveQuest();
          const completed = skillTree.completedQuests;

          const questList = [
            ...availableQuests.map(q => ({
              id: q.id,
              title: q.title,
              difficulty: q.difficulty,
              status: 'available' as const,
              xpReward: q.xpReward,
            })),
            ...(activeQuest ? [{
              id: activeQuest.id,
              title: activeQuest.title,
              difficulty: activeQuest.difficulty,
              status: 'active' as const,
              xpReward: activeQuest.xpReward,
            }] : []),
          ];

          addLine('system', CLIFormatter.formatQuestList(questList));
          if (completed.length > 0) {
            addLine('system', `\nCompleted Quests: ${completed.length}\n[exit 0]`);
          }
        }
        break;

      // ========== CHALLENGE COMMANDS ==========
      case 'solve':
        {
          const currentNode = gameEngine.getCurrentNode();
          if (!currentNode) {
            addLine('error', CLIFormatter.formatError('No current node', 1));
            break;
          }

          // Map matrix node IDs → quest IDs (node IDs and skill IDs are separate namespaces)
          const NODE_QUEST_MAP: Record<string, string> = {
            '0': 'main-01', // Sovereign_Core  → The Awakening
            '1': 'main-03', // Orchestration_Log → First Delegation
            '2': 'main-02', // Neural_Terminal → Meeting The Architect
            '3': 'main-06', // WASM_Forge      → Building the Swarm
          };
          // Fallback: match node type → quest category for dynamically added nodes
          const NODE_TYPE_QUEST_CATEGORY: Record<string, string> = {
            'AGENT_LOGIC': 'ORCHESTRATION',
            'CLI_INTERFACE': 'REASONING',
            'LOW_LEVEL_ENGINE': 'CODING',
            'COGNITIVE_BASE': 'ORCHESTRATION',
            'VALIDATION': 'REASONING',
            'BRANCH': 'ORCHESTRATION',
          };

          const directQuestId = NODE_QUEST_MAP[currentNode.id];
          const quest = directQuestId
            ? MAIN_QUESTS.find(q => q.id === directQuestId)
            : MAIN_QUESTS.find(q => q.category === NODE_TYPE_QUEST_CATEGORY[currentNode.data.type]);

          if (!quest) {
            addLine('error', CLIFormatter.formatError('No challenge available at this node', 1));
            break;
          }

          const started = gameEngine.startChallenge(currentNode.id, quest.id);
          if (started) {
            addLine('system', `╔═══════════════════════════════════════════════════╗\n║  CHALLENGE INITIATED: ${quest.title.padEnd(28)} ║\n╠═══════════════════════════════════════════════════╣\n║  ${quest.description.padEnd(48)} ║\n╠═══════════════════════════════════════════════════╣\n║  Difficulty: ${quest.difficulty.padEnd(36)} ║\n║  Reward: ${(quest.xpReward + ' XP + ' + quest.goldReward + ' GOLD').padEnd(40)} ║\n╚═══════════════════════════════════════════════════╝\n\n${quest.narrative}\n\nUse: submit <code> to complete\n[exit 0]`);
          } else {
            addLine('error', CLIFormatter.formatError('Failed to start challenge', 1));
          }
        }
        break;

      case 'submit':
        if (!argument) {
          addLine('error', CLIFormatter.formatError('Usage: submit <code>', 1));
        } else {
          const result = await gameEngine.submitSolution(argument);
          if (result.success) {
            addLine('system', CLIFormatter.formatSuccess(`✓ CHALLENGE COMPLETED!\n${result.feedback}`, 0));
          } else {
            addLine('error', CLIFormatter.formatError(`✗ FAILED\n${result.feedback}`, 1));
          }
        }
        break;

      case 'abandon':
        {
          if (!gameEngine.activeChallenge) {
            addLine('error', CLIFormatter.formatError('No active challenge', 1));
          } else {
            gameEngine.abandonChallenge();
            addLine('system', CLIFormatter.formatSuccess('Challenge abandoned', 0));
          }
        }
        break;

      // ========== FORK COMMANDS ==========
      case 'fork':
        {
          const subCommand = args[0]?.toLowerCase();
          const forkArg = args.slice(1).join(' ');

          switch (subCommand) {
            case 'status':
              {
                const fork = gameEngine.getForkAtCurrentNode();
                if (!fork) {
                  addLine('system', 'No fork at current location.\n[exit 0]');
                } else {
                  addLine('system', CLIFormatter.formatForkChoices(fork.choices));
                }
              }
              break;

            case 'choose':
              if (!forkArg) {
                addLine('error', CLIFormatter.formatError('Usage: fork choose <label>', 1));
              } else {
                const success = gameEngine.chooseForkPath(forkArg);
                if (success) {
                  addLine('system', CLIFormatter.formatSuccess(`Path chosen: ${forkArg}`, 0));
                } else {
                  addLine('error', CLIFormatter.formatError('Invalid choice or no fork at current location', 1));
                }
              }
              break;

            case 'preview':
              if (!forkArg) {
                addLine('error', CLIFormatter.formatError('Usage: fork preview <label>', 1));
              } else {
                const preview = gameEngine.previewForkPath(forkArg);
                addLine('system', preview + '\n[exit 0]');
              }
              break;

            default:
              addLine('error', CLIFormatter.formatError('Usage: fork <status|choose|preview> [args]', 1));
          }
        }
        break;

      // ========== KNOWLEDGE BASE COMMANDS ==========
      case 'ingest':
        {
          if (!argument) {
            addLine('system', `Usage:\n  ingest <url>           Ingest a URL into the knowledge base\n  ingest --yt <id>       Ingest a YouTube transcript\n  ingest --gh <repo>     Ingest a GitHub repository\n  ingest --notion <id>   Ingest a Notion page\n[exit 0]`);
            break;
          }

          let ingestType = 'url';
          let ingestTarget = argument;

          if (args[0] === '--yt') {
            ingestType = 'youtube';
            ingestTarget = args.slice(1).join(' ');
          } else if (args[0] === '--gh') {
            ingestType = 'github';
            ingestTarget = args.slice(1).join(' ');
          } else if (args[0] === '--notion') {
            ingestType = 'notion';
            ingestTarget = args.slice(1).join(' ');
          } else if (args[0] === '--md') {
            ingestType = 'markdown';
            ingestTarget = args.slice(1).join(' ');
          }

          if (!ingestTarget) {
            addLine('error', CLIFormatter.formatError(`Usage: ingest --${ingestType === 'youtube' ? 'yt' : ingestType === 'github' ? 'gh' : ingestType === 'markdown' ? 'md' : 'notion'} <target>`, 1));
            break;
          }

          setIsProcessing(true);
          try {
            const ingestRes = await fetch('/api/knowledge/ingest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: ingestType, target: ingestTarget }),
            });

            const ingestData = await ingestRes.json();

            if (!ingestRes.ok) {
              addLine('error', CLIFormatter.formatError(ingestData.error || 'Ingest failed', 1));
            } else {
              addLine('system', CLIFormatter.formatSuccess(`Source ingested successfully`, 0) + `\n  Title:      ${ingestData.title || 'Untitled'}\n  Source ID:  ${ingestData.sourceId}\n  Chunks:     ${ingestData.chunkCount}\n[exit 0]`);
            }
          } catch (err: any) {
            addLine('error', CLIFormatter.formatError(`Ingest failed: ${err.message || 'Network error'}`, 1));
          }
          setIsProcessing(false);
        }
        break;

      case 'recall':
        {
          if (!argument) {
            addLine('error', CLIFormatter.formatError('Usage: recall <query>', 1));
            break;
          }

          setIsProcessing(true);
          try {
            const recallRes = await fetch('/api/knowledge/query', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: argument, limit: 3 }),
            });

            const recallData = await recallRes.json();

            if (!recallRes.ok) {
              addLine('error', CLIFormatter.formatError(recallData.error || 'Query failed', 1));
            } else if (!recallData.results || recallData.results.length === 0) {
              addLine('system', `No results found. Try ingesting sources first with: ingest <url>\n[exit 0]`);
            } else {
              let recallOutput = `┌─────────────────────────────────────────────────────────────┐\n│  RECALL RESULTS                                             │\n├─────────────────────────────────────────────────────────────┤\n`;
              recallData.results.forEach((result: any, idx: number) => {
                const truncated = (result.content || '').slice(0, 200) + ((result.content || '').length > 200 ? '...' : '');
                recallOutput += `│  [${idx + 1}] ${(result.sourceTitle || 'Unknown').padEnd(40)}       │\n`;
                recallOutput += `│      Similarity: ${(String(Math.round((result.similarity || 0) * 100)) + '%').padEnd(42)}│\n`;
                recallOutput += `│      ${truncated.padEnd(57)}│\n`;
                if (idx < recallData.results.length - 1) recallOutput += `├─────────────────────────────────────────────────────────────┤\n`;
              });
              recallOutput += `└─────────────────────────────────────────────────────────────┘\n[exit 0]`;
              addLine('system', recallOutput);
            }
          } catch (err: any) {
            addLine('error', CLIFormatter.formatError(`Recall failed: ${err.message || 'Network error'}`, 1));
          }
          setIsProcessing(false);
        }
        break;

      case 'sources':
        {
          setIsProcessing(true);
          try {
            const sourcesRes = await fetch('/api/knowledge/sources');
            const sourcesData = await sourcesRes.json();

            if (!sourcesRes.ok) {
              addLine('error', CLIFormatter.formatError(sourcesData.error || 'Failed to fetch sources', 1));
            } else if (!sourcesData.sources || sourcesData.sources.length === 0) {
              addLine('system', `No sources ingested yet. Use: ingest <url>\n[exit 0]`);
            } else {
              let sourcesOutput = `┌────────┬──────────┬──────────────────────────────┬────────┬────────┐\n│  ID    │  TYPE    │  TITLE                       │  STATUS│  CHUNKS│\n├────────┼──────────┼──────────────────────────────┼────────┼────────┤\n`;
              sourcesData.sources.forEach((source: any) => {
                const id = String(source.id || '').slice(0, 6).padEnd(6);
                const type = (source.type || 'unknown').slice(0, 8).padEnd(8);
                const title = (source.title || 'Untitled').slice(0, 28).padEnd(28);
                const status = (source.status || 'ok').slice(0, 6).padEnd(6);
                const chunks = String(source.chunkCount || 0).padEnd(6);
                sourcesOutput += `│  ${id}│  ${type}│  ${title}│  ${status}│  ${chunks}│\n`;
              });
              sourcesOutput += `└────────┴──────────┴──────────────────────────────┴────────┴────────┘\n[exit 0]`;
              addLine('system', sourcesOutput);
            }
          } catch (err: any) {
            addLine('error', CLIFormatter.formatError(`Sources failed: ${err.message || 'Network error'}`, 1));
          }
          setIsProcessing(false);
        }
        break;

      case 'forget':
        {
          if (!argument) {
            addLine('error', CLIFormatter.formatError('Usage: forget <source-id>', 1));
            break;
          }

          setIsProcessing(true);
          try {
            const forgetRes = await fetch(`/api/knowledge/sources?id=${encodeURIComponent(argument)}`, {
              method: 'DELETE',
            });

            const forgetData = await forgetRes.json();

            if (!forgetRes.ok) {
              addLine('error', CLIFormatter.formatError(forgetData.error || 'Failed to remove source', 1));
            } else {
              addLine('system', CLIFormatter.formatSuccess(`Source ${argument} removed from knowledge base`, 0) + '\n[exit 0]');
            }
          } catch (err: any) {
            addLine('error', CLIFormatter.formatError(`Forget failed: ${err.message || 'Network error'}`, 1));
          }
          setIsProcessing(false);
        }
        break;

      case 'stats':
        {
          const statsOutput = `╔═══════════════════════════════════════════════════════════════╗
║  RLM — REINFORCEMENT LEARNING MEMORY                        ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Architecture:  Multi-Agent Retrieval-Augmented Generation    ║
║  Vector Store:  Semantic chunking + cosine similarity         ║
║  Reranking:     Cross-encoder hybrid scoring                  ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  AGENT FLEET                                                  ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  [1] Builder Agent                                            ║
║      Model:   gemini-3-flash                                  ║
║      Context: 1M tokens                                       ║
║      Role:    Code generation & architecture decisions        ║
║                                                               ║
║  [2] Analyst Agent                                            ║
║      Model:   gemini-3-flash                                  ║
║      Context: 1M tokens                                       ║
║      Role:    Pattern recognition & data analysis             ║
║                                                               ║
║  [3] Curator Agent                                            ║
║      Model:   gemini-3-flash                                  ║
║      Context: 1M tokens                                       ║
║      Role:    Knowledge base curation & source ranking        ║
║                                                               ║
║  [4] Orchestrator Agent                                       ║
║      Model:   gemini-3-pro                                    ║
║      Context: 1M tokens                                       ║
║      Role:    Task routing & multi-agent coordination         ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  TIP: Use 'ingest' to load sources, 'recall' to query them   ║
╚═══════════════════════════════════════════════════════════════╝
[exit 0]`;
          addLine('system', statsOutput);
        }
        break;

      // ========== SHOW ME THE MONEY COMMAND ==========
      default: {
        // Check for showmethemoney command (flexible matching)
        const normalized = trimmedCmd.toLowerCase().replace(/\s/g, '');
        const lowerCmd = trimmedCmd.toLowerCase();
        const isShowMeTheMoney = 
          normalized === 'showmethemoney' ||
          normalized.includes('showmethemoney') ||
          lowerCmd.includes('money') ||
          lowerCmd.includes('financial') ||
          lowerCmd.includes('business plan') ||
          lowerCmd.includes('businessplan');
        
        if (isShowMeTheMoney) {
          addLine('system', `
╔═══════════════════════════════════════════════════════════════╗
║  💰 ACCESSING FINANCIAL VAULT...                              ║
╠═══════════════════════════════════════════════════════════════╣
║  📊 LOADING_BUSINESS_PLAN_V1.0...                             ║
║  💰 FINANCIAL_PROJECTIONS_DECRYPTED                           ║
║  ✓ CLEARANCE_GRANTED                                          ║
╠═══════════════════════════════════════════════════════════════╣
║  Redirecting to Business Plan...                              ║
╚═══════════════════════════════════════════════════════════════╝`);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('apexos:close'));
            // Navigate to showmethemoney page
            window.location.href = '/showmethemoney';
          }, 1500);
          break;
        }

        // ========== DEFAULT: AI NATURAL LANGUAGE ==========
        setIsProcessing(true);
        const res = await callAI(trimmedCmd);
        setIsProcessing(false);
        addLine('system', CLIFormatter.convertMarkdownToCLI(res));
        break;
      }
    }
  }, [addLine, callAI, gameEngine, skillTree]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+C to cancel
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      if (isProcessing) {
        setIsProcessing(false);
        addLine('system', '^C');
        addLine('system', '[ Process interrupted ]');
      }
      return;
    }

    // Tab completion
    if (e.key === 'Tab') {
      e.preventDefault();
      const inputLower = input.toLowerCase();
      const matches = COMMANDS.filter(cmd => cmd.startsWith(inputLower));
      if (matches.length === 1) {
        setInput(matches[0] + ' ');
      } else if (matches.length > 1) {
        addLine('system', `\n  ${matches.join('  ')}\n`);
      }
      return;
    }

    if (e.key === 'Enter' && !isProcessing) {
      e.preventDefault();
      e.stopPropagation();
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex === commandHistory.length - 1 ? -1 : historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(nextIdx === -1 ? '' : commandHistory[nextIdx] || '');
      }
    }
  }, [input, isProcessing, processCommand, commandHistory, historyIndex]);

  return (
    <div 
      ref={terminalRef}
      className={`flex-1 flex flex-col bg-zinc-950 rounded-2xl border border-cyan-500/10 overflow-hidden transition-all duration-300 ease-out pointer-events-auto ${className}`}
      onClick={() => inputRef.current?.focus()}
      style={{
        // Ensure smooth transitions during resize
        willChange: terminalSize.width > 0 ? 'auto' : 'transform',
        touchAction: 'manipulation'
      }}
    >
      <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-cyan-500/5 to-transparent flex items-center gap-3 pointer-events-none">
        <Terminal className="w-5 h-5 text-cyan-400" />
        <span className="text-white font-semibold tracking-wide uppercase tracking-[0.2em]">Apex OS</span>
        <span className="text-white/30 text-xs">v1.2.0_SOVEREIGN</span>
        <div className="ml-auto flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400/60" />
          <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Neural Link Active</span>
        </div>
      </div>

      <div 
        ref={outputRef}
        className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4 no-scrollbar terminal-scrollable custom-scrollbar pointer-events-auto"
        style={{
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
        onWheel={(e) => {
          // Allow the terminal to handle its own scrolling
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Allow the terminal to handle its own touch scrolling
          e.stopPropagation();
        }}
      >
        {lines.map((line) => (
          <div key={line.id} className="pointer-events-auto">
            {line.type === 'input' && <div className="text-yellow-400/90">{line.content as string}</div>}
            {line.type === 'system' && <div className="text-cyan-400/90 whitespace-pre-wrap">{line.content as string}</div>}
            {line.type === 'error' && <div className="text-red-400">✗ {line.content as string}</div>}
            {line.type === 'branding' && <div className="pointer-events-none">{line.content}</div>}
            {line.type === 'ai' && (
              <div className="text-white/80 pointer-events-auto">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase mb-2">
                  <Sparkles className="w-3 h-3" /> APEX AI
                </span>
                <div className="mt-1 pl-4 border-l-2 border-emerald-500/30 ml-1">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ inline, children, className, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return inline ? (
                          <code className="px-1 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-xs" {...props}>{children}</code>
                        ) : (
                          <TerminalCodeBlock language={match ? match[1] : undefined}>
                            {String(children).replace(/\n$/, '')}
                          </TerminalCodeBlock>
                        );
                      },
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    }}
                  >
                    {line.content as string}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center gap-2 text-cyan-400/70 pointer-events-none">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest animate-pulse">Neural Handshake...</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 bg-zinc-900/50 p-4 pointer-events-auto">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isProcessing && input.trim()) {
              const currentInput = input;
              setInput('');
              processCommand(currentInput);
              setTimeout(() => inputRef.current?.focus(), 10);
            }
          }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1 flex-shrink-0 font-mono text-xs pointer-events-none">
            <span className="text-emerald-400">apex</span>
            <span className="text-white/30">@</span>
            <span className="text-cyan-400">sovereign</span>
            <span className="text-white/30">:</span>
            <span className="text-violet-400">~</span>
            <span className="text-cyan-500 ml-1">$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing || isBooting}
            placeholder={isProcessing ? 'Thinking...' : 'Enter command...'}
            className="w-full bg-transparent outline-none text-white font-mono placeholder:text-white/20 min-h-[44px] text-base pointer-events-auto"
            style={{ touchAction: 'manipulation' }}
            autoFocus
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};

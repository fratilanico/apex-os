'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useMatrixStore } from '@/stores/useMatrixStore';
import { useGameEngine } from '@/stores/useGameEngine';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { useSession, type SessionState } from '@/hooks/useSession';
import { validateCommandPayload, sanitizeInput } from '@/lib/validation/terminalSchemas';
import { withTimeout, retryWithBackoff, CircuitBreaker } from '@/lib/utils/resilience';
import { commandRegistry, executeCommand, type CommandContext } from '@/lib/terminal/commands';
import { 
  APEX_LOGO_ASCII, 
  PLAYER_ONE_ASCII, 
  COMMANDS, 
  HELP_TEXT, 
  VIBE_QUOTES,
  ERROR_MESSAGES,
  SYSTEM_MESSAGES,
  TERMINAL_CONFIG 
} from '@/lib/terminal/constants';
import type { ApexTerminalLine } from '@/lib/terminal/types';
import { TerminalHeader } from './components/TerminalHeader';
import { TerminalOutput } from './components/TerminalOutput';
import { TerminalInput } from './components/TerminalInput';
import { NeuralBoard } from './components/NeuralBoard';
import { NeuralPixelBranding } from './components/NeuralPixelBranding';
import * as CLIFormatter from '@/lib/cliFormatter';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX TERMINAL HUD v2.0 — AGENTS.md Compliant Implementation
// ═══════════════════════════════════════════════════════════════════════════════

// Idempotency key generator for API calls
const generateIdempotencyKey = (): string => 
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${crypto.randomUUID().slice(0, 8)}`;

// Circuit breaker for external API calls
const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  timeoutDuration: 30000,
  halfOpenMaxCalls: 3,
  successThreshold: 2
});

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface ApexTerminalHUDProps {
  className?: string;
}

const ApexTerminalHUDInner: React.FC<ApexTerminalHUDProps> = ({ className = '' }) => {
  // 1. State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [lines, setLines] = useState<ApexTerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  
  // 2. Store hooks
  const { syncTerminalContext, processDirectorResponse, nodes, edges } = useMatrixStore();
  const gameEngine = useGameEngine();
  const skillTree = useSkillTreeStore();
  
  // 3. Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const latestSessionRef = useRef<Partial<SessionState<ApexTerminalLine>>>({});
  const processedCommands = useRef<Set<string>>(new Set());

  // 4. Session management
  const { loadState, saveState, clearSession, setupAutoSave } = useSession<ApexTerminalLine>({
    terminalId: 'apex-os-terminal',
    autoSaveInterval: 4000,
  });

  // 5. Utility: Add line
  const addLine = useCallback((type: ApexTerminalLine['type'], content: ApexTerminalLine['content']) => {
    const newLine: ApexTerminalLine = {
      id: generateId(),
      type,
      content,
      timestamp: new Date(),
    };
    setLines(prev => [...prev.slice(-99), newLine]);
  }, []);

  // 6. AI Interaction Logic
  const callAI = useCallback(async (message: string): Promise<string> => {
    const idempotencyKey = generateIdempotencyKey();
    
    if (processedCommands.current.has(idempotencyKey)) {
      return ERROR_MESSAGES.ALREADY_PROCESSING;
    }
    processedCommands.current.add(idempotencyKey);

    try {
      const history = lines
        .filter(l => l.type === 'input' || l.type === 'ai')
        .slice(-10)
        .map(l => ({
          role: l.type === 'input' ? 'user' : 'assistant',
          content: typeof l.content === 'string' ? l.content.replace(/^> /, '') : '',
        }));

      const data = await apiCircuitBreaker.execute(async () => {
        return retryWithBackoff(async () => {
          const response = await withTimeout(
            fetch('/api/terminal-vertex', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey,
              },
              body: JSON.stringify({ message, history }),
            }),
            TERMINAL_CONFIG.API_TIMEOUT_MS,
            'Terminal API request timeout'
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP_${response.status}`);
          }

          return response.json();
        }, {
          maxRetries: TERMINAL_CONFIG.MAX_RETRY_ATTEMPTS,
          baseDelay: 100,
          maxDelay: 5000,
        });
      });
      
      syncTerminalContext(data.response || '');
      
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

      return data.response || SYSTEM_MESSAGES.NEURAL_HANDSHAKE_COMPLETE;
    } catch (err: any) {
      console.error('AI call error:', err);
      return ERROR_MESSAGES.SYSTEM_OFFLINE(err.message || '500');
    } finally {
      setTimeout(() => {
        processedCommands.current.delete(idempotencyKey);
      }, 60000);
    }
  }, [lines, nodes, edges, syncTerminalContext, processDirectorResponse]);

  // 7. Command Processing Logic
  const processCommand = useCallback(async (rawInput: string) => {
    const trimmedCmd = rawInput.trim();
    if (!trimmedCmd) return;

    const sanitizedInput = sanitizeInput(trimmedCmd);
    const validation = validateCommandPayload({ 
      command: sanitizedInput.split(' ')[0],
      args: sanitizedInput.split(' ').slice(1),
      metadata: { timestamp: new Date().toISOString() }
    });

    if (!validation.success) {
      addLine('error', ERROR_MESSAGES.INVALID_COMMAND(validation.errors?.errors?.[0]?.message || 'Validation failed'));
      return;
    }

    setCommandHistory(prev => [...prev.slice(-49), sanitizedInput]);
    setHistoryIndex(-1);
    addLine('input', `> ${sanitizedInput}`);

    const [command, ...args] = sanitizedInput.split(' ');
    const cmd = command?.toLowerCase();

    if (!cmd) {
      addLine('error', 'Invalid command');
      return;
    }

    const context: CommandContext = {
      addLine,
      gameEngine,
      skillTree,
      matrixStore: { syncTerminalContext, processDirectorResponse, nodes, edges },
      callAI,
      setIsProcessing,
      clearSession,
      setLines: (lines) => setLines(lines.map(l => ({ ...l, timestamp: new Date(l.timestamp) }))),
      setCommandHistory,
      setHistoryIndex,
      setInput,
    };

    try {
      const entry = commandRegistry[cmd];
      if (entry) {
        setIsProcessing(true);
        await executeCommand(cmd, context, args);
        setIsProcessing(false);
      } else {
        const normalized = sanitizedInput.toLowerCase().replace(/\s/g, '');
        if (normalized === 'showmethemoney' || normalized.includes('money')) {
          addLine('system', SYSTEM_MESSAGES.ACCESSING_VAULT);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('apexos:close'));
            window.location.href = '/showmethemoney';
          }, 1500);
        } else {
          setIsProcessing(true);
          const res = await callAI(sanitizedInput);
          setIsProcessing(false);
          addLine('system', CLIFormatter.convertMarkdownToCLI(res));
        }
      }
    } catch (error: any) {
      console.error('Command execution error:', error);
      addLine('error', ERROR_MESSAGES.COMMAND_FAILED(error.message));
      setIsProcessing(false);
    }
  }, [addLine, callAI, gameEngine, skillTree, syncTerminalContext, processDirectorResponse, nodes, edges, clearSession]);

  // 8. Effects
  useEffect(() => {
    const restored = loadState();
    if (!restored) return;

    const restoredLines = Array.isArray(restored.lines) ? (restored.lines as ApexTerminalLine[]) : [];
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
    const resizeObserver = new ResizeObserver(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });
    resizeObserver.observe(terminalRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (hasRestoredSession) return;
    const boot = async () => {
      setIsBooting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      addLine('branding', <NeuralPixelBranding isAuthorized={isAuthorized} />);
      setIsBooting(false);
    };
    boot();
  }, [addLine, hasRestoredSession, isAuthorized]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cmd = params.get('cmd');
    if (cmd && !isBooting) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      setTimeout(() => processCommand(cmd), 1000);
    }
  }, [isBooting, processCommand]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAuthorized(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 9. Render
  return (
    <div
      ref={terminalRef}
      className={`flex-1 flex flex-col bg-zinc-950 rounded-2xl border border-cyan-500/10 overflow-hidden min-h-0 transition-all duration-300 pointer-events-auto ${className}`}
      onClick={() => inputRef.current?.focus()}
      style={{ touchAction: 'manipulation' }}
    >
      <TerminalHeader />

      <TerminalOutput 
        ref={outputRef}
        lines={lines}
        isProcessing={isProcessing}
      />

      <div className="p-4 flex flex-col md:flex-row items-center gap-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 relative shrink-0">
        <div className="shrink-0">
          <NeuralBoard isAuthorized={isAuthorized} className="hidden md:block" />
          <div className="md:hidden w-full flex justify-center mb-2">
             <NeuralBoard isAuthorized={isAuthorized} className="scale-75 origin-top" />
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <TerminalInput
            ref={inputRef}
            input={input}
            setInput={setInput}
            isProcessing={isProcessing}
            isAuthorized={isAuthorized}
            commandHistory={commandHistory}
            historyIndex={historyIndex}
            setHistoryIndex={setHistoryIndex}
            processCommand={processCommand}
            addLine={addLine}
          />
        </div>
      </div>
    </div>
  );
};

export const ApexTerminalHUD: React.FC<ApexTerminalHUDProps> = (props) => (
  <ErrorBoundary
    fallback={
      <div className="flex-1 flex flex-col bg-zinc-950 rounded-2xl border border-red-500/30 p-6">
        <h3 className="text-red-400 font-bold mb-2">Terminal Error</h3>
        <p className="text-white/60 text-sm">The terminal encountered an error. Please refresh the page.</p>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error('ApexTerminalHUD Error:', error, errorInfo);
    }}
  >
    <ApexTerminalHUDInner {...props} />
  </ErrorBoundary>
);

export { APEX_LOGO_ASCII, PLAYER_ONE_ASCII, COMMANDS, HELP_TEXT, VIBE_QUOTES };
export type { ApexTerminalLine };

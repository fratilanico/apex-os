'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { thawVM, executeQuest, type MicroVM } from '@/lib/codeMachine';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { Terminal, Cpu, RefreshCcw, Power, Zap } from 'lucide-react';

const COMMANDS = {
  deploy: 'Initialize and deploy secure guest VM',
  upgrade: 'Upgrade VM tier (costs gold)',
  status: 'Show current VM status',
  clear: 'Clear terminal logs',
  help: 'Show available commands',
} as const;

export const CodeMachineHUD: React.FC = () => {
  const { gold, addGold, addDMLog, setNarrative } = useSkillTreeStore();
  const [vm, setVm] = useState<MicroVM | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tier, setTier] = useState<MicroVM['tier']>('BASIC');
  
  // Terminal input state
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startQuest = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setLogs(prev => [...prev, `[HOST] Allocating resources for ${tier} guest...`]);
    
    try {
      const thawnVm = await thawVM('vm-alpha-01', tier);
      setVm(thawnVm);
      setLogs(prev => [...prev, `[HOST] MicroVM Running (Latency: ${thawnVm.metrics.latency}ms)`]);

      const result = await executeQuest(thawnVm, 'swarm.deploy()');
      setLogs(prev => [...prev, ...result.logs]);
      
      if (result.success) {
        addGold(25);
        addDMLog(`CODE MACHINE: Deployment Successful // +25 Gold earned.`);
      } else if (result.error) {
        setLogs(prev => [...prev, `[CRITICAL] ${result.error}`]);
        addDMLog(`HARDWARE ALERT: Guest Kernel Panic // Protocol Aborted.`);
        setNarrative("A hardware breach was detected. The Code Machine is recalibrating.");
      }
    } catch {
      setLogs(prev => [...prev, '[HOST] ERROR: Snapstart timeout.']);
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, tier, addGold, addDMLog, setNarrative]);

  const upgradeTier = useCallback(() => {
    if (tier === 'BASIC' && gold >= 500) {
      setTier('PERFORMANCE');
      addGold(-500);
      addDMLog(`SYSTEM UPGRADE: VM Guest Tier set to PERFORMANCE.`);
      setLogs(prev => [...prev, '[HOST] Tier upgraded to PERFORMANCE']);
    } else if (tier === 'PERFORMANCE' && gold >= 2000) {
      setTier('APEX');
      addGold(-2000);
      addDMLog(`SYSTEM UPGRADE: VM Guest Tier set to APEX.`);
      setLogs(prev => [...prev, '[HOST] Tier upgraded to APEX']);
    } else if (tier === 'APEX') {
      setLogs(prev => [...prev, '[HOST] Already at maximum tier']);
    } else {
      const cost = tier === 'BASIC' ? 500 : 2000;
      setLogs(prev => [...prev, `[HOST] Insufficient gold. Need ${cost}G (have ${gold}G)`]);
    }
  }, [tier, gold, addGold, addDMLog]);

  const showStatus = useCallback(() => {
    const statusLines = [
      '[HOST] === VM STATUS ===',
      `[HOST] Tier: ${tier}`,
      `[HOST] Gold: ${gold}G`,
      `[HOST] VM State: ${vm ? 'RUNNING' : 'IDLE'}`,
    ];
    if (vm) {
      statusLines.push(
        `[HOST] Latency: ${vm.metrics.latency}ms`,
        `[HOST] Memory: ${vm.metrics.memoryUsage}MB`
      );
    }
    setLogs(prev => [...prev, ...statusLines]);
  }, [tier, gold, vm]);

  const showHelp = useCallback(() => {
    const helpLines = [
      '[HOST] === AVAILABLE COMMANDS ===',
      ...Object.entries(COMMANDS).map(([cmd, desc]) => `[HOST] ${cmd.padEnd(10)} - ${desc}`),
    ];
    setLogs(prev => [...prev, ...helpLines]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    // Add command to history
    setCommandHistory(prev => {
      const newHistory = [...prev.filter(c => c !== trimmedCmd), trimmedCmd];
      // Keep only last 50 commands
      return newHistory.slice(-50);
    });
    setHistoryIndex(-1);

    // Echo the command
    setLogs(prev => [...prev, `> ${cmd}`]);

    // Process commands
    switch (trimmedCmd) {
      case 'deploy':
        startQuest();
        break;
      case 'upgrade':
        upgradeTier();
        break;
      case 'status':
        showStatus();
        break;
      case 'clear':
        clearLogs();
        break;
      case 'help':
        showHelp();
        break;
      default:
        setLogs(prev => [...prev, `[HOST] Unknown command: ${trimmedCmd}. Type 'help' for available commands.`]);
    }
  }, [startQuest, upgradeTier, showStatus, clearLogs, showHelp]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Code Machine v1.0</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-2 py-1 rounded text-[8px] font-black uppercase border ${
            tier === 'APEX' ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' :
            tier === 'PERFORMANCE' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' :
            'bg-zinc-800 border-white/10 text-white/40'
          }`}>
            {tier} TIER
          </div>
          {vm && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-center">
          <p className="text-[8px] font-bold text-white/20 uppercase mb-1">Latency</p>
          <p className="text-sm font-black text-white font-mono">{vm ? `${vm.metrics.latency}ms` : '--'}</p>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-center">
          <p className="text-[8px] font-bold text-white/20 uppercase mb-1">Memory</p>
          <p className="text-sm font-black text-white font-mono">{vm ? `${vm.metrics.memoryUsage}MB` : '--'}</p>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-center group cursor-pointer" onClick={upgradeTier}>
          <p className="text-[8px] font-bold text-white/20 uppercase mb-1 group-hover:text-cyan-400 transition-colors">Upgrade</p>
          <Zap className="w-4 h-4 text-white/10 mx-auto group-hover:text-yellow-400 transition-colors" />
        </div>
      </div>

      {/* Terminal Area with Input */}
      <div 
        className="h-48 bg-zinc-950 rounded-xl border border-white/10 font-mono text-[10px] overflow-hidden mb-6 flex flex-col cursor-text"
        onClick={focusInput}
      >
        {/* Log Output Area */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 gap-2">
              <Terminal className="w-8 h-8" />
              <p className="text-[8px] uppercase tracking-[0.2em]">Type &apos;help&apos; for commands</p>
            </div>
          ) : (
            <>
              {logs.map((log, i) => (
                <p 
                  key={i} 
                  className={
                    log.startsWith('>') 
                      ? 'text-cyan-400' 
                      : log.includes('[HOST]') 
                        ? 'text-cyan-400/70' 
                        : log.includes('[CRITICAL]') 
                          ? 'text-red-400' 
                          : 'text-white/60'
                  }
                >
                  {log}
                </p>
              ))}
              <div ref={logsEndRef} />
            </>
          )}
        </div>
        
        {/* Input Area */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isExecuting && inputValue.trim()) {
              processCommand(inputValue);
              setInputValue('');
              setTimeout(() => inputRef.current?.focus(), 10);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 border-t border-white/5 bg-zinc-900/50"
        >
          <span className="text-cyan-400 font-bold select-none">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="enter command..."
            disabled={isExecuting}
            className="flex-1 bg-transparent text-white/90 placeholder-white/20 outline-none font-mono text-[10px] disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="send"
          />
          {isExecuting && (
            <RefreshCcw className="w-3 h-3 text-cyan-400 animate-spin" />
          )}
        </form>
      </div>

      <button
        onClick={startQuest}
        disabled={isExecuting}
        className={`w-full py-3 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
          isExecuting ? 'bg-zinc-800 border-white/10 text-white/20' : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
        }`}
      >
        {isExecuting ? (
          <RefreshCcw className="w-4 h-4 animate-spin" />
        ) : (
          <Power className="w-4 h-4" />
        )}
        {isExecuting ? 'Guest Running...' : 'Initialize Secure Guest'}
      </button>
    </div>
  );
};

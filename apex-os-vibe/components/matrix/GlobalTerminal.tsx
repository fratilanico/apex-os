// APEX OS Vibe - Global Terminal
// Bottom-center FAB design (OpenAI/Claude/Vercel style)
// Preserving the SOUL of the design

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Send, Command } from 'lucide-react';

interface GlobalTerminalProps {
  onCommand?: (command: string) => void;
}

export const GlobalTerminal: React.FC<GlobalTerminalProps> = ({ onCommand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; content: string }>>([
    {
      type: 'output',
      content: 'APEX OS Matrix Terminal v1.0.0',
    },
    {
      type: 'output',
      content: 'Second Brain + Agent Swarm Active',
    },
    {
      type: 'output',
      content: 'Type "help" for available commands',
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = () => {
    if (!command.trim()) return;

    setHistory((prev) => [...prev, { type: 'input', content: command }]);

    // Mock command responses
    const cmd = command.toLowerCase().trim();
    let response = '';

    switch (cmd) {
      case 'help':
        response = `Available commands:
  help              Show this help message
  swarm status      Display agent swarm status
  brain stats       Show second brain statistics
  agents list       List all available agents
  memories search   Search memory index
  clear             Clear terminal history
  exit              Close terminal`;
        break;
      case 'swarm status':
        response =
          'SWARM STATUS: ONLINE\n  Active agents: 19/19\n  Module coverage: 6/6\n  Queue: 0 pending';
        break;
      case 'brain stats':
        response =
          'SECOND BRAIN STATISTICS:\n  Total memories: 1,247\n  Connections: 3,892\n  Index size: 45.2 MB\n  Last sync: 2 minutes ago';
        break;
      case 'agents list':
        response = `AVAILABLE AGENTS:
  foundation.config-agent      [ONLINE]  5cr
  foundation.doc-agent         [ONLINE]  5cr
  frontend.ui-agent            [BUSY]    10cr
  frontend.frontend-agent      [ONLINE]  10cr
  backend.backend-agent        [ONLINE]  10cr
  ... and 14 more`;
        break;
      case 'memories search':
        response =
          'USAGE: memories search <query>\n  Example: memories search "authentication"';
        break;
      case 'clear':
        setHistory([]);
        setCommand('');
        return;
      case 'exit':
        setIsOpen(false);
        setCommand('');
        return;
      default:
        if (cmd.startsWith('memories search ')) {
          const query = cmd.replace('memories search ', '');
          response = `Searching memories for "${query}"...\n  Found 3 results:\n  - auth-middleware.ts\n  - jwt-implementation.md\n  - login-component.tsx`;
        } else {
          response = `Command not found: ${command}\nType "help" for available commands`;
        }
    }

    setTimeout(() => {
      setHistory((prev) => [...prev, { type: 'output', content: response }]);
    }, 100);

    setCommand('');
    onCommand?.(command);
  };

  return (
    <>
      {/* Bottom-Center FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 
                   flex items-center gap-2 px-4 py-3 rounded-full
                   border transition-all duration-300
                   ${
                     isOpen
                       ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                       : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/20'
                   }`}
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            <span className="text-sm font-mono font-bold">CLOSE</span>
          </>
        ) : (
          <>
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-mono font-bold">TERMINAL</span>
          </>
        )}
      </motion.button>

      {/* Terminal Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Terminal Window */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#030303] border-t border-cyan-500/30 
                         h-[70vh] max-h-[600px] flex flex-col shadow-2xl"
            >
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white font-mono">matrix@apex-os:~$</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Terminal Output */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2"
              >
                {history.map((entry, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {entry.type === 'input' ? (
                      <div className="flex items-start gap-2">
                        <span className="text-cyan-400">$</span>
                        <span className="text-white">{entry.content}</span>
                      </div>
                    ) : (
                      <div className="text-white/70 pl-4">{entry.content}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal Input */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">$</span>
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommand();
                      if (e.key === 'Escape') setIsOpen(false);
                    }}
                    className="flex-1 bg-transparent outline-none text-white font-mono text-sm
                               placeholder-white/30"
                    placeholder="Type command..."
                    autoFocus
                  />
                  <button
                    onClick={handleCommand}
                    disabled={!command.trim()}
                    className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 
                               disabled:opacity-30 disabled:cursor-not-allowed
                               hover:bg-cyan-500/30 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalTerminal;

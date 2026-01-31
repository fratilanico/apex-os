import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, X, MessageSquare, BookOpen, Rocket, Lock, Unlock } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const TerminalV2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'chat' | 'learn' | 'deploy'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: Message['role'], content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userInput = input.trim();
    setInput('');
    addMessage('user', userInput);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      addMessage('assistant', `You said: ${userInput}\n\nThis is a test response from TerminalV2.`);
      setIsProcessing(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-zinc-900 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-lg"
      >
        <Terminal className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50 w-[calc(100vw-32px)] md:w-[600px] bg-black/95 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-mono text-white/80">apex.terminal</span>
            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">{mode}</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'chat', icon: MessageSquare, label: 'Chat' },
            { id: 'learn', icon: BookOpen, label: 'Learn' },
            { id: 'deploy', icon: Rocket, label: 'Deploy' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm ${
                mode === m.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="h-[300px] overflow-y-auto p-4 space-y-3 font-mono text-sm">
          {messages.length === 0 && (
            <div className="text-white/40 text-center py-8">
              Welcome to APEX OS Terminal v2.0
              <br />
              Type a message to get started
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                    : 'bg-white/5 text-white/90 border border-white/10'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <span className="animate-pulse">...</span> Processing
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 text-sm font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalV2;

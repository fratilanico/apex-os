'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { 
  Bot, Sword, ScrollText, ChevronRight, Send, Zap, 
  Cpu, Search, Workflow, Terminal as TerminalIcon, Trash2, Activity
} from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'companion';
  timestamp: Date;
  isAI?: boolean;
}

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

const AGENT_ICONS: Record<string, any> = {
  sovereign: Bot,
  architect: Cpu,
  builder: Workflow,
  scout: Search,
  terminal: TerminalIcon,
  user: Zap
};

const AGENT_COLORS: Record<string, string> = {
  sovereign: 'text-cyan-400',
  architect: 'text-purple-400',
  builder: 'text-emerald-400',
  scout: 'text-amber-400',
  terminal: 'text-blue-400',
  user: 'text-pink-400'
};

const COMPANION_RESPONSES = {
  help: [
    "APEX OS is your command center, Player One. The skill tree tracks your progression through AI mastery.",
    "Need navigation tips? The sidebar shows your active quest and system logs. Your journey continues even when you step away.",
  ],
  default: [
    "Keep pushing forward, Player One. Every line of code is a step toward mastery.",
    "The Frontier rewards persistence. Your next breakthrough is closer than you think.",
  ],
};

function getRandomResponse(responses: string[]): string {
  const resp = responses[Math.floor(Math.random() * responses.length)];
  return resp ?? "Keep pushing forward, Player One.";
}

export const DungeonMasterSidebar: React.FC = () => {
  const { 
    narrativeContext, 
    dmLogs, 
    activeQuestId, 
    addDMLog, 
    orchestrationStream, 
    clearOrchestrationStream 
  } = useSkillTreeStore();
  
  const logEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const orchEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'orchestration'>('narrative');

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dmLogs]);

  useEffect(() => {
    orchEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orchestrationStream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const buildHistory = useCallback((): ChatHistoryItem[] => {
    return chatMessages.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
  }, [chatMessages]);

  const fetchAIResponse = useCallback(async (message: string, history: ChatHistoryItem[]) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) throw new Error('API down');
      const data = await res.json();
      return { response: data.response, isAI: true };
    } catch (e) {
      return { response: getRandomResponse(COMPANION_RESPONSES.default), isAI: false };
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, text, sender: 'user', timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    if (text.toLowerCase().includes('help')) addDMLog(`SYSTEM_QUERY: "${text}"`);

    const history = [...buildHistory(), { role: 'user' as const, content: text }];
    const { response, isAI } = await fetchAIResponse(text, history);
    
    setChatMessages(prev => [...prev, {
      id: `c-${Date.now()}`,
      text: response,
      sender: 'companion',
      timestamp: new Date(),
      isAI
    }]);
    setIsTyping(false);
  }, [inputValue, isTyping, addDMLog, buildHistory, fetchAIResponse]);

  return (
    <div className="w-80 h-full bg-zinc-950 border-l border-white/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
              <Bot className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight text-sm">GPT-5.2</h3>
            <p className="text-cyan-400/60 text-[9px] font-mono uppercase tracking-widest">Architect Companion</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 p-1 mx-4 mt-4 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab('narrative')}
          className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'narrative' ? 'bg-zinc-900 text-cyan-400' : 'text-white/40 hover:text-white/60'}`}
        >
          Narrative
        </button>
        <button
          onClick={() => setActiveTab('orchestration')}
          className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'orchestration' ? 'bg-zinc-900 text-cyan-400' : 'text-white/40 hover:text-white/60'}`}
        >
          Stream
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col pt-4 min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'narrative' ? (
            <motion.div 
              key="narrative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col px-4 pb-2 min-h-0"
            >
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <Sword className="w-4 h-4 text-cyan-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400/80">Active Quest</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1 truncate">{activeQuestId || "The First Step"}</h4>
                <p className="text-[10px] text-white/40 leading-relaxed line-clamp-3">{narrativeContext}</p>
              </div>

              <div className="flex items-center gap-2 mb-3 px-2">
                <ScrollText className="w-3.5 h-3.5 text-white/20" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">System Logs</span>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 px-2">
                {dmLogs.map((log, i) => (
                  <div key={i} className="flex gap-2 text-[10px] font-mono text-white/60 leading-tight">
                    <span className="text-cyan-500/40">»</span>
                    <p>{log}</p>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="orchestration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col px-4 pb-2 min-h-0"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[9px] font-bold uppercase text-cyan-400">Agent_Chatter</span>
                </div>
                <button onClick={clearOrchestrationStream} className="p-1 text-white/20 hover:text-red-400"><Trash2 size={12} /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 px-2">
                {orchestrationStream.length === 0 ? (
                  <div className="h-full flex items-center justify-center opacity-10 uppercase text-[8px] font-mono tracking-tighter">No Active Swarms</div>
                ) : (
                  orchestrationStream.map((log) => (
                    <div key={log.id} className="p-2.5 bg-white/5 border border-white/5 rounded-lg space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1 rounded bg-black/40 ${AGENT_COLORS[log.from.toLowerCase()] || 'text-white/40'}`}>
                          {React.createElement(AGENT_ICONS[log.from.toLowerCase()] || Bot, { size: 8 })}
                        </div>
                        <ChevronRight size={6} className="text-white/10" />
                        <div className={`p-1 rounded bg-black/40 ${AGENT_COLORS[log.to.toLowerCase()] || 'text-white/40'}`}>
                          {React.createElement(AGENT_ICONS[log.to.toLowerCase()] || Bot, { size: 8 })}
                        </div>
                        <span className="text-[7px] font-mono text-white/10 ml-auto">{log.timestamp.slice(11, 19)}</span>
                      </div>
                      <p className="text-[9px] font-mono text-white/70 leading-snug border-l border-cyan-500/20 pl-2">{log.message}</p>
                    </div>
                  ))
                )}
                <div ref={orchEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Interface */}
      <div className="border-t border-white/5 bg-black/20 p-3">
        <div className="overflow-y-auto max-h-32 mb-3 space-y-2 no-scrollbar">
          {chatMessages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] px-2.5 py-1.5 rounded-lg text-[10px] leading-relaxed ${m.sender === 'user' ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20' : 'bg-zinc-800 text-white/80'}`}>
                {m.text}
                {m.sender === 'companion' && (
                  <span className={`inline-flex ml-1.5 text-[7px] font-black uppercase ${m.isAI ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {m.isAI ? '[AI]' : '[FB]'}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form 
          onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask the Architect..."
            className="flex-1 h-9 px-3 bg-zinc-900 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500/30"
            autoComplete="off"
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping} className="w-9 h-9 flex items-center justify-center bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-cyan-400 disabled:opacity-30">
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

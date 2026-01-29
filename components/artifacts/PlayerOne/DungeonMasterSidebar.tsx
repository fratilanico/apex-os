'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { Bot, Sparkles, Sword, ScrollText, ChevronRight, Send, Zap } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'companion';
  timestamp: Date;
  isAI?: boolean; // true = real AI response, false = fallback
}

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

const COMPANION_RESPONSES = {
  help: [
    "APEX OS is your command center, Player One. The skill tree tracks your progression through AI mastery. Each node represents a capability you've unlocked. The quest log guides your journey - complete objectives to earn XP and unlock new skills.",
    "Need navigation tips? The sidebar shows your active quest and system logs. Click on skill nodes to see prerequisites. Your progress is saved automatically - the journey continues even when you step away.",
    "The interface responds to your growth. As you complete quests and unlock skills, new pathways reveal themselves. Think of it as a living map of your AI engineering evolution.",
  ],
  quest: [
    "Your current quest is the next step in your evolution. Focus on the objectives - each completed task brings you closer to mastery. Remember: the journey matters as much as the destination.",
    "Quests are designed to build upon each other. Complete your active quest to unlock new challenges. XP and Gold rewards await those who persevere.",
    "Stuck on a quest? Break it down into smaller steps. Every complex system is just a series of simple actions executed with intention.",
  ],
  tip: [
    "Pro tip: Let the AI handle the syntax, you focus on the architecture. The best vibe coders think in systems, not semicolons.",
    "Here's a secret: The most powerful prompt is a clear intention. Know what you want to build, and the code will follow.",
    "Remember: AI is a multiplier, not a replacement. Your creativity and judgment are what transform generated code into elegant solutions.",
    "Debugging tip: When AI code doesn't work, explain the problem back to it. Teaching is the fastest path to understanding.",
  ],
  advice: [
    "My advice? Ship early, iterate often. Perfect is the enemy of deployed.",
    "The best code is the code you don't write. Let AI handle boilerplate while you architect the experience.",
    "When in doubt, prototype. A working demo is worth a thousand design documents.",
  ],
  vibe: [
    '"The vibe coder doesn\'t fight the current - they become the current." - Ancient wisdom from the Frontier',
    '"In the age of AI, taste becomes the ultimate skill. Anyone can generate code, few can curate excellence." - Player One Philosophy',
    '"We don\'t write code anymore. We conduct symphonies of intent, with AI as our orchestra." - The Architect\'s Manifesto',
    '"Speed is a feature. Ship fast, learn faster." - Vibe Coder Creed',
    '"The future belongs to those who can see it. Build what doesn\'t exist yet." - Frontier Wisdom',
  ],
  default: [
    "Keep pushing forward, Player One. Every line of code is a step toward mastery.",
    "The Frontier rewards persistence. Your next breakthrough is closer than you think.",
    "I sense great potential in you. Trust the process and embrace the chaos of creation.",
    "Remember why you started. The vision is worth the struggle.",
    "You're not just learning to code - you're learning to shape reality. That's no small thing.",
    "The best builders doubt themselves too. The difference is they build anyway.",
  ],
};

function getRandomResponse(responses: readonly string[]): string {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index] ?? responses[0] ?? "Keep pushing forward, Player One.";
}

function getFallbackResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('help')) {
    return getRandomResponse(COMPANION_RESPONSES.help);
  }
  
  if (lowerInput.includes('quest') || lowerInput.includes('mission') || lowerInput.includes('objective')) {
    return getRandomResponse(COMPANION_RESPONSES.quest);
  }
  
  if (lowerInput.includes('tip') || lowerInput.includes('trick')) {
    return getRandomResponse(COMPANION_RESPONSES.tip);
  }
  
  if (lowerInput.includes('advice') || lowerInput.includes('suggest')) {
    return getRandomResponse(COMPANION_RESPONSES.advice);
  }
  
  if (lowerInput.includes('vibe') || lowerInput.includes('philosophy') || lowerInput.includes('wisdom')) {
    return getRandomResponse(COMPANION_RESPONSES.vibe);
  }
  
  return getRandomResponse(COMPANION_RESPONSES.default);
}

export const DungeonMasterSidebar: React.FC = () => {
  const { narrativeContext, dmLogs, activeQuestId, addDMLog } = useSkillTreeStore();
  const logEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dmLogs]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Build conversation history for API (last 10 messages)
  const buildConversationHistory = useCallback((): ChatHistoryItem[] => {
    return chatMessages
      .slice(-10)
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      }));
  }, [chatMessages]);

  // Fetch response from API with retry mechanism
  const fetchAIResponse = useCallback(async (
    message: string,
    history: ChatHistoryItem[],
    retryCount = 0
  ): Promise<{ response: string; isAI: boolean }> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history }),
      });

      if (!res.ok) {
        if (retryCount < 2) {
          console.warn(`Architect Handshake failed (attempt ${retryCount + 1}). Retrying...`);
          await new Promise(r => setTimeout(r, 1000));
          return fetchAIResponse(message, history, retryCount + 1);
        }
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return { response: data.response, isAI: true };
    } catch (error) {
      if (retryCount < 2) {
        console.warn(`Architect connection failed (attempt ${retryCount + 1}). Retrying...`);
        await new Promise(r => setTimeout(r, 1000));
        return fetchAIResponse(message, history, retryCount + 1);
      }
      console.warn('AI API failed after retries, using fallback:', error);
      // Return fallback response
      return { response: getFallbackResponse(message), isAI: false };
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setChatMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Log significant interactions to DM logs
    if (trimmedInput.toLowerCase().includes('help') || trimmedInput.toLowerCase().includes('quest')) {
      addDMLog(`COMPANION QUERY: "${trimmedInput.slice(0, 30)}${trimmedInput.length > 30 ? '...' : ''}"`);
    }

    // Build history before adding user message (since state hasn't updated yet)
    const history = [
      ...buildConversationHistory(),
      { role: 'user' as const, content: trimmedInput },
    ].slice(-10);

    try {
      // Call the real API
      const { response, isAI } = await fetchAIResponse(trimmedInput, history);
      
      const companionMessage: ChatMessage = {
        id: `companion-${Date.now()}`,
        text: response,
        sender: 'companion',
        timestamp: new Date(),
        isAI,
      };
      
      setChatMessages((prev) => [...prev, companionMessage]);
    } catch (error) {
      // This shouldn't happen since fetchAIResponse handles errors,
      // but just in case...
      console.error('Unexpected error:', error);
      const fallbackMessage: ChatMessage = {
        id: `companion-${Date.now()}`,
        text: getFallbackResponse(trimmedInput),
        sender: 'companion',
        timestamp: new Date(),
        isAI: false,
      };
      setChatMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, addDMLog, buildConversationHistory, fetchAIResponse]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  return (
    <div className="w-80 h-full bg-zinc-950 border-l border-white/5 flex flex-col overflow-hidden">
      {/* Companion Avatar */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden group">
              <Bot className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight">GPT-5.2</h3>
            <p className="text-cyan-400/60 text-[10px] font-mono uppercase tracking-widest">Architect Companion</p>
          </div>
        </div>
      </div>

      {/* Active Quest */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-center gap-3 mb-2">
            <Sword className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/80">Active Quest</span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {activeQuestId || "The First Step: Orchestration"}
          </h4>
          <p className="text-xs text-white/40 leading-relaxed">
            {narrativeContext}
          </p>
          
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500" 
              initial={{ width: 0 }}
              animate={{ width: '35%' }}
            />
          </div>
        </div>
      </div>

      {/* Narrative Log */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 pb-2 min-h-0">
        <div className="flex items-center gap-2 mb-3 px-2">
          <ScrollText className="w-3.5 h-3.5 text-white/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">System Logs</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 px-2 min-h-0">
          {dmLogs.length === 0 ? (
            <p className="text-[10px] font-mono text-white/10 italic">Initializing narrative streams...</p>
          ) : (
            dmLogs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <ChevronRight className="w-3 h-3 text-cyan-500/40 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-mono text-white/60 leading-relaxed">
                  {log}
                </p>
              </motion.div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="border-t border-white/5 flex flex-col max-h-[45%]">
        {/* Chat Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400/60" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Companion Chat</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-[80px] max-h-[160px]">
          {chatMessages.length === 0 ? (
            <p className="text-[10px] font-mono text-white/20 italic text-center py-4">
              Ask for help, tips, or vibe coder wisdom...
            </p>
          ) : (
            <AnimatePresence mode="popLayout">
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed relative ${
                      message.sender === 'user'
                        ? 'bg-cyan-500/20 text-cyan-100 rounded-br-sm'
                        : 'bg-zinc-800 text-white/80 rounded-bl-sm'
                    }`}
                  >
                    {message.text}
                    {/* AI Badge for companion messages */}
                    {message.sender === 'companion' && (
                      <span 
                        className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide flex items-center gap-0.5 ${
                          message.isAI 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                        title={message.isAI ? 'Powered by Gemini AI' : 'Fallback response'}
                      >
                        <Zap className="w-2 h-2" />
                        {message.isAI ? 'AI' : 'FB'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="bg-zinc-800 px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-zinc-900/50">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isTyping && inputValue.trim()) {
              handleSendMessage();
              setTimeout(() => inputRef.current?.focus(), 10);
            }
          }}
          className="flex gap-2"
        >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Architect..."
              disabled={isTyping}
              className="flex-1 min-h-[44px] px-4 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
              enterKeyHint="send"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-white/5 border border-cyan-500/30 disabled:border-white/10 rounded-xl text-cyan-400 disabled:text-white/20 transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

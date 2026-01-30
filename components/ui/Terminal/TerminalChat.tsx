/**
 * TerminalChat Component
 * Main chat interface for both Gemini and ClawBot with NLP curriculum support
 */

import React, { useState, useRef, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { ModeSwitcher } from './ModeSwitcher';
import { useTerminalStore } from '../../../stores/terminalStore';
import { useNavigate } from 'react-router-dom';
import { nlpParser, type NLPSearchResult } from '../../artifacts/CurriculumLog/NLPCommandParser';

interface NLPMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'nlp';
  content: string;
  metadata?: {
    nlpResult?: NLPSearchResult;
    model?: string;
    toolsUsed?: string[];
  };
}

// Format NLP result for terminal display
const formatNLPResult = (result: NLPSearchResult): string => {
  let formatted = '';
  
  if (result.type === 'help') {
    formatted = `${result.title}\n\n${result.content}`;
  } else if (result.type === 'module') {
    formatted = `${result.title}\n\n${result.content}`;
  } else if (result.type === 'section') {
    formatted = `${result.title}\n\n${result.content}`;
    if (result.relatedSections && result.relatedSections.length > 0) {
      formatted += `\n\nRelated sections:\n`;
      result.relatedSections.forEach(section => {
        formatted += `  • ${section.title}\n`;
      });
    }
  } else if (result.type === 'tool') {
    formatted = `${result.title}\n\n${result.content}`;
    if (result.relatedSections && result.relatedSections.length > 0) {
      formatted += `\n\nLearn more in:\n`;
      result.relatedSections.forEach(section => {
        formatted += `  • ${section.title}\n`;
      });
    }
  }
  
  if (result.suggestions && result.suggestions.length > 0) {
    formatted += `\n\nTry asking:\n`;
    result.suggestions.forEach(suggestion => {
      formatted += `  • "${suggestion}"\n`;
    });
  }
  
  return formatted;
};

// Check if command is showmethemoney (flexible matching)
const isShowMeTheMoneyCommand = (cmd: string): boolean => {
  const normalized = cmd.toLowerCase().replace(/\s/g, '');
  const lowerCmd = cmd.toLowerCase();
  return (
    normalized === 'showmethemoney' ||
    normalized.includes('showmethemoney') ||
    lowerCmd.includes('money') ||
    lowerCmd.includes('financial') ||
    lowerCmd.includes('business plan') ||
    lowerCmd.includes('businessplan')
  );
};

export const TerminalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<NLPMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { 
    mode, 
    gemini, 
    clawbot,
    sendToGemini, 
    sendToClawBot,
    clearGeminiHistory,
    clearClawBotHistory
  } = useTerminalStore();
  
  // Get messages based on current mode and merge with local NLP messages
  const storeMessages: NLPMessage[] = mode === 'gemini' 
    ? gemini.messages.map((msg, idx) => ({
        id: `gemini-${idx}`,
        role: msg.role,
        content: msg.content,
        metadata: undefined
      }))
    : (clawbot.session?.messages || []).filter(m => m.role !== 'system').map((msg, idx) => ({
        id: `clawbot-${idx}`,
        role: msg.role,
        content: msg.content,
        metadata: undefined
      }));
  
  // Combine store messages with local NLP messages
  const messages = [...storeMessages, ...localMessages];
  
  const isProcessing = mode === 'gemini'
    ? gemini.isProcessing
    : (clawbot.session?.isProcessing || false);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        inputRef.current?.focus();
      } catch (e) {
        console.warn('Focus error in 3D context:', e);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Clear local messages when switching modes or clearing history
  useEffect(() => {
    setLocalMessages([]);
  }, [mode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const message = input.trim();
    setInput('');

    // Check for showmethemoney command FIRST (before other processing)
    if (isShowMeTheMoneyCommand(message)) {
      // Add visual feedback message
      const systemMessage: NLPMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: '💰 ACCESSING FINANCIAL VAULT...\n📊 LOADING_BUSINESS_PLAN_V1.0...\n💰 FINANCIAL_PROJECTIONS_DECRYPTED\n✓ CLEARANCE_GRANTED\nRedirecting to Business Plan...',
      };
      setLocalMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
      }, systemMessage]);
      setTimeout(() => navigate('/showmethemoney'), 1500);
      return;
    }
    
    // Check if it's a natural language curriculum query
    const nlpResult = nlpParser.parseQuery(message);
    
    if (nlpResult && nlpResult.confidence > 0.5) {
      // It's a curriculum query - show NLP result directly without calling AI
      const nlpMessage: NLPMessage = {
        id: `nlp-${Date.now()}`,
        role: 'user',
        content: message,
      };
      
      const nlpResponse: NLPMessage = {
        id: `nlp-response-${Date.now()}`,
        role: 'nlp',
        content: formatNLPResult(nlpResult),
        metadata: { nlpResult }
      };
      
      setLocalMessages(prev => [...prev, nlpMessage, nlpResponse]);
      return;
    }
    
    // Not a curriculum query - proceed with normal AI processing
    try {
      if (mode === 'gemini') {
        await sendToGemini(message);
      } else {
        sendToClawBot(message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleClear = () => {
    if (confirm('Clear chat history?')) {
      setLocalMessages([]);
      if (mode === 'gemini') {
        clearGeminiHistory();
      } else {
        clearClawBotHistory();
      }
    }
  };
  
  // Get placeholder text with NLP hints
  const getPlaceholderText = () => {
    if (mode === 'gemini') {
      return 'Ask about curriculum: "What is the shift mindset?" or "Tell me about module 2"...';
    } else if (clawbot.status.connected) {
      return 'Ask ClawBot to help you build or ask about curriculum...';
    } else {
      return 'Waiting for ClawBot connection...';
    }
  };
  
  return (
    <TerminalWindow title={mode === 'gemini' ? 'gemini.terminal' : 'clawbot.terminal'}>
      {/* Mode Switcher */}
      <ModeSwitcher />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="text-center text-white/50 py-12">
            <div className="text-4xl mb-4">{mode === 'gemini' ? '⚡' : '🦞'}</div>
            <p className="font-mono text-sm">
              {mode === 'gemini' 
                ? 'Gemini is ready. Ask me anything!' 
                : clawbot.status.connected
                  ? 'ClawBot is connected. Let\'s build something!'
                  : 'Connecting to ClawBot...'}
            </p>
            <p className="font-mono text-xs text-white/30 mt-4">
              Try: "What is the shift mindset?" or "Tell me about Cursor"
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-lg px-4 py-2.5 font-mono text-sm
                  ${msg.role === 'user'
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                    : msg.role === 'nlp'
                      ? 'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-100 border border-purple-500/20'
                  }
                `}
              >
                {/* Message Header */}
                <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                  <span>
                    {msg.role === 'user' 
                      ? 'You' 
                      : msg.role === 'nlp'
                        ? '📚 Curriculum'
                        : (mode === 'gemini' ? 'Gemini' : 'ClawBot')
                    }
                  </span>
                  {msg.metadata?.model && (
                    <span className="text-white/40">• {msg.metadata.model}</span>
                  )}
                </div>
                
                {/* Message Content */}
                <div className="whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
                
                {/* Metadata (for ClawBot) */}
                {msg.metadata?.toolsUsed && msg.metadata.toolsUsed.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/50">
                    🔧 Tools: {msg.metadata.toolsUsed.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-purple-500/10 text-purple-100 border border-purple-500/20 rounded-lg px-4 py-2.5 font-mono text-sm">
              <span className="animate-pulse">●●●</span> {mode === 'gemini' ? 'Gemini' : 'ClawBot'} is thinking...
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {mode === 'clawbot' && clawbot.session?.error && (
          <div className="bg-red-500/10 text-red-300 border border-red-500/30 rounded-lg px-4 py-2.5 font-mono text-sm">
            <strong>Error:</strong> {clawbot.session.error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={getPlaceholderText()}
          disabled={isProcessing || (mode === 'clawbot' && !clawbot.status.connected)}
          className="
            flex-1 px-4 py-2.5 bg-black/40 border border-white/20 rounded-lg
            text-white/90 font-mono text-sm
            focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-white/30
          "
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isProcessing || (mode === 'clawbot' && !clawbot.status.connected)}
          className="
            px-6 py-2.5 bg-cyan-500/20 border border-cyan-500/50 rounded-lg
            text-cyan-400 font-mono text-sm font-semibold
            hover:bg-cyan-500/30 hover:border-cyan-500/70
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          Send
        </button>
        
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="
              px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg
              text-red-400 font-mono text-sm
              hover:bg-red-500/20 hover:border-red-500/50
              transition-all duration-200
            "
          >
            Clear
          </button>
        )}
      </form>
    </TerminalWindow>
  );
};

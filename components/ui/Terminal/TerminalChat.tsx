/**
 * TerminalChat Component
 * Main chat interface for both Gemini and ClawBot
 */

import React, { useState, useRef, useEffect } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { ModeSwitcher } from './ModeSwitcher';
import { useTerminalStore } from '../../../stores/terminalStore';

export const TerminalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    mode, 
    gemini, 
    clawbot,
    sendToGemini, 
    sendToClawBot,
    clearGeminiHistory,
    clearClawBotHistory
  } = useTerminalStore();
  
  // Get messages based on current mode (normalized to ClawBotMessage format)
  const messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata?: any;
  }> = mode === 'gemini' 
    ? gemini.messages.map((msg, idx) => ({
        id: `gemini-${idx}`,
        role: msg.role,
        content: msg.content,
        metadata: undefined
      }))
    : (clawbot.session?.messages || []).filter(m => m.role !== 'system');
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const message = input.trim();
    setInput('');
    
    try {
      if (mode === 'gemini') {
        await sendToGemini(message);
      } else {
        sendToClawBot(message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error to user
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleClear = () => {
    if (confirm('Clear chat history?')) {
      if (mode === 'gemini') {
        clearGeminiHistory();
      } else {
        clearClawBotHistory();
      }
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
                    : 'bg-purple-500/10 text-purple-100 border border-purple-500/20'
                  }
                `}
              >
                {/* Message Header */}
                <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                  <span>{msg.role === 'user' ? 'You' : (mode === 'gemini' ? 'Gemini' : 'ClawBot')}</span>
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
          placeholder={
            mode === 'gemini' 
              ? 'Ask Gemini anything...' 
              : clawbot.status.connected
                ? 'Ask ClawBot to help you build...'
                : 'Waiting for ClawBot connection...'
          }
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

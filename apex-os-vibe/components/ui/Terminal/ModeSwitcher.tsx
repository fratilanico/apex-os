/**
 * ModeSwitcher Component
 * Toggle between Gemini and ClawBot modes
 */

import React from 'react';
import { useTerminalStore } from '../../../stores/terminalStore';
import type { AIMode } from '../../../types/clawbot';

export const ModeSwitcher: React.FC = () => {
  const { mode, setMode, clawbot } = useTerminalStore();
  const { status } = clawbot;
  
  const handleModeChange = (newMode: AIMode) => {
    if (mode === newMode) return;
    setMode(newMode);
  };
  
  return (
    <div className="flex gap-2 mb-4 p-2 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm">
      {/* Gemini Mode Button */}
      <button
        onClick={() => handleModeChange('gemini')}
        className={`
          flex-1 px-4 py-2.5 rounded-md font-mono text-sm transition-all duration-200
          flex items-center justify-center gap-2 relative
          ${mode === 'gemini'
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
            : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 hover:bg-white/10'
          }
        `}
        aria-label="Switch to Gemini mode"
      >
        <span className="text-lg">⚡</span>
        <span className="font-semibold">Gemini</span>
        {mode === 'gemini' && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        )}
      </button>
      
      {/* ClawBot Mode Button */}
      <button
        onClick={() => handleModeChange('clawbot')}
        className={`
          flex-1 px-4 py-2.5 rounded-md font-mono text-sm transition-all duration-200
          flex items-center justify-center gap-2 relative
          ${mode === 'clawbot'
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-lg shadow-purple-500/20'
            : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 hover:bg-white/10'
          }
        `}
        aria-label="Switch to ClawBot mode"
      >
        <span className="text-lg">🦞</span>
        <span className="font-semibold">ClawBot</span>
        
        {/* Connection Status Indicator */}
        {mode === 'clawbot' && (
          <>
            {status.connected && (
              <span 
                className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"
                title="Connected"
              />
            )}
            {status.reconnecting && (
              <span 
                className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                title={`Reconnecting (${status.reconnectAttempts} attempts)`}
              />
            )}
            {!status.connected && !status.reconnecting && (
              <span 
                className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"
                title="Disconnected"
              />
            )}
          </>
        )}
      </button>
    </div>
  );
};

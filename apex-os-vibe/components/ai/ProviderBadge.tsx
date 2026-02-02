import React, { useState } from 'react';
import { Zap, Diamond, Cpu, Cloud, X, Activity } from 'lucide-react';

export interface ProviderBadgeProps {
  provider: 'perplexity' | 'groq' | 'gemini' | 'cohere' | 'offline';
  model?: string;
  latency?: number;
  tier?: number;
  isProcessing?: boolean;
  className?: string;
}

interface ProviderConfig {
  icon: React.ReactNode;
  label: string;
  defaultModel: string;
  color: string;
  bgColor: string;
  glowColor: string;
  borderColor: string;
  tier: number;
}

const providerConfigs: Record<'perplexity' | 'groq' | 'gemini' | 'cohere' | 'offline', ProviderConfig> = {
  perplexity: {
    icon: <Zap className="w-3 h-3" />,
    label: 'Perplexity',
    defaultModel: 'sonar-reasoning-pro',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    glowColor: 'shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    borderColor: 'border-cyan-500/30',
    tier: 1,
  },
  groq: {
    icon: <Cpu className="w-3 h-3" />,
    label: 'Groq',
    defaultModel: 'llama-3.1-70b',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    glowColor: 'shadow-[0_0_8px_rgba(167,139,250,0.4)]',
    borderColor: 'border-violet-500/30',
    tier: 2,
  },
  gemini: {
    icon: <Diamond className="w-3 h-3" />,
    label: 'Gemini',
    defaultModel: 'gemini-1.5-flash',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    glowColor: 'shadow-[0_0_8px_rgba(251,191,36,0.4)]',
    borderColor: 'border-amber-500/30',
    tier: 3,
  },
  cohere: {
    icon: <Cloud className="w-3 h-3" />,
    label: 'Cohere',
    defaultModel: 'command-r',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    glowColor: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]',
    borderColor: 'border-emerald-500/30',
    tier: 4,
  },
  offline: {
    icon: <X className="w-3 h-3" />,
    label: 'Offline',
    defaultModel: 'N/A',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    glowColor: 'shadow-[0_0_8px_rgba(248,113,113,0.4)]',
    borderColor: 'border-red-500/30',
    tier: 0,
  },
};

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({
  provider,
  model,
  latency,
  tier,
  isProcessing = false,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = providerConfigs[provider] || providerConfigs.offline;
  const displayModel = model || config.defaultModel;
  const displayLatency = latency !== undefined ? `${latency}ms` : '--';
  const displayTier = tier || config.tier;

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-md
          border ${config.borderColor}
          ${config.bgColor}
          backdrop-blur-sm
          transition-all duration-200
          hover:scale-105
          ${isProcessing ? 'animate-pulse' : ''}
          ${isProcessing ? config.glowColor : ''}
          max-w-[120px]
        `}
      >
        <span className={`${config.color} flex-shrink-0`}>
          {config.icon}
        </span>
        <span className={`${config.color} text-xs font-medium font-mono truncate`}>
          {config.label}
        </span>
        {displayTier > 1 && (
          <span className="text-[10px] text-gray-500 font-mono">
            T{displayTier}
          </span>
        )}
        {isProcessing && (
          <Activity className={`w-2.5 h-2.5 ${config.color} animate-ping`} />
        )}
      </div>

      {showTooltip && (
        <div
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-2 rounded-lg
            bg-black/90 border ${config.borderColor}
            shadow-lg ${config.glowColor}
            z-50
            min-w-[200px]
          `}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Provider</span>
              <span className={`text-xs font-medium font-mono ${config.color}`}>
                {config.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Tier</span>
              <span className={`text-xs font-mono ${config.color}`}>
                {displayTier === 1 ? 'Primary' : `Fallback ${displayTier - 1}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Model</span>
              <span className="text-xs text-cyan-300 font-mono truncate max-w-[100px]">
                {displayModel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Latency</span>
              <span className="text-xs text-emerald-400 font-mono">
                {displayLatency}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-700/50">
              <span className="text-xs text-gray-400 font-mono">Status</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    provider === 'offline'
                      ? 'bg-red-400'
                      : isProcessing
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-emerald-400'
                  }`}
                />
                <span className="text-xs text-gray-300 font-mono">
                  {provider === 'offline'
                    ? 'Offline'
                    : isProcessing
                    ? 'Processing'
                    : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`
              absolute top-full left-1/2 -translate-x-1/2
              w-0 h-0
              border-l-[6px] border-l-transparent
              border-r-[6px] border-r-transparent
              border-t-[6px]
              ${config.borderColor.replace('border-', 'border-t-')}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default ProviderBadge;

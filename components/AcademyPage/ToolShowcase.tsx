import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  tier: 'core' | 'asset';
  icon: string;
}

interface ToolShowcaseProps {
  tools: Tool[];
}

export const ToolShowcase: React.FC<ToolShowcaseProps> = ({ tools }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | 'core' | 'asset'>('all');

  const coreTools = tools.filter(t => t.tier === 'core');
  const assetTools = tools.filter(t => t.tier === 'asset');
  const displayTools = selectedTier === 'all' ? tools : tools.filter(t => t.tier === selectedTier);

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as Icons.LucideIcon;
    return IconComponent || Icons.Box;
  };

  return (
    <div className="space-y-5">
      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            selectedTier === 'all'
              ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
              : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
          }`}
        >
          ALL_TOOLS ({tools.length})
        </button>
        <button
          onClick={() => setSelectedTier('core')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            selectedTier === 'core'
              ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
              : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
          }`}
        >
          CORE_STACK ({coreTools.length})
        </button>
        <button
          onClick={() => setSelectedTier('asset')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            selectedTier === 'asset'
              ? 'bg-violet-500/20 border border-violet-500/30 text-violet-400'
              : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
          }`}
        >
          ASSET_LAYER ({assetTools.length})
        </button>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayTools.map((tool) => {
          const Icon = getIcon(tool.icon);
          return (
            <div
              key={tool.id}
              className={`rounded-lg p-4 border bg-white/[0.02] hover:bg-white/[0.04] transition-colors ${
                tool.tier === 'core' 
                  ? 'border-white/10 hover:border-cyan-500/30' 
                  : 'border-white/10 hover:border-violet-500/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  tool.tier === 'core' 
                    ? 'bg-cyan-500/10 border border-cyan-500/20' 
                    : 'bg-violet-500/10 border border-violet-500/20'
                }`}>
                  <Icon className={`w-4 h-4 ${tool.tier === 'core' ? 'text-cyan-400' : 'text-violet-400'}`} />
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  tool.tier === 'core' 
                    ? 'bg-cyan-500/10 text-cyan-400' 
                    : 'bg-violet-500/10 text-violet-400'
                }`}>
                  {tool.category}
                </span>
              </div>

              {/* Tool Name */}
              <h4 className="text-sm font-semibold text-white mb-1">
                {tool.name}
              </h4>

              {/* Description */}
              <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

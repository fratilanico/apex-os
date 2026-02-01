// APEX OS Vibe - Second Brain Panel
// Card List style matching AcademyPage design
// Preserving the SOUL of the vibe-portfolio aesthetic

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, Activity, Sparkles } from 'lucide-react';
import { soul, getMemoryTypeColor } from '../../lib/theme';

export interface MemoryNode {
  id: string;
  type: 'file' | 'agent_output' | 'conversation' | 'concept' | 'code' | 'event';
  title: string;
  content: string;
  timestamp: string;
  connections: number;
  metadata?: {
    moduleId?: string;
    agentId?: string;
    fileType?: string;
    size?: number;
    tags?: string[];
  };
}

interface SecondBrainPanelProps {
  memories: MemoryNode[];
  isConnected: boolean;
  onSearch?: (query: string) => void;
}

export const SecondBrainPanel: React.FC<SecondBrainPanelProps> = ({
  memories,
  isConnected,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const memoryTypes = ['file', 'agent_output', 'conversation', 'concept', 'code'];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="h-full flex flex-col bg-[#030303]">
      {/* Header - Sticky with glass effect */}
      <div className="sticky top-0 z-10 bg-[#030303]/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Second Brain</h2>
              <p className="text-xs text-white/40 font-mono">
                {memories.length} memories indexed
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3
                       text-sm text-white placeholder-white/40 font-mono
                       focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border font-mono
              ${
                !selectedType
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                  : 'bg-white/5 text-white/60 border-white/10'
              }`}
          >
            ALL
          </button>
          {memoryTypes.map((type) => {
            const colors = getMemoryTypeColor(type);
            return (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border font-mono
                  ${
                    selectedType === type
                      ? `${colors.bg} ${colors.text} ${colors.border}`
                      : 'bg-white/5 text-white/60 border-white/10'
                  }`}
              >
                {type.replace('_', '.')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredMemories.map((memory, index) => {
            const typeColors = getMemoryTypeColor(memory.type);
            return (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4
                           hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer group"
              >
                {/* Terminal Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-rose-400/80" />
                      <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      {memory.type.replace('_', '.')}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-white/30">
                    {new Date(memory.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Content */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColors.bg} ${typeColors.text}`}
                  >
                    <span className="text-lg">{typeColors.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-white truncate group-hover:text-cyan-400 transition-colors">
                      {memory.title}
                    </h3>

                    <p className="text-xs text-white/60 mt-1 line-clamp-2 font-mono">
                      {memory.content}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[10px] text-white/40 font-mono">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {memory.connections} connections
                      </span>

                      {memory.metadata?.fileType && (
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                          {memory.metadata.fileType}
                        </span>
                      )}

                      {memory.metadata?.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredMemories.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-mono">NO_MEMORIES_FOUND</p>
            <p className="text-xs mt-1">Try adjusting your search parameters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondBrainPanel;

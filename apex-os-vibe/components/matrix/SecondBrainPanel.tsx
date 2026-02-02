import React, { useState } from 'react';
import type { SecondBrainState, MemoryNode } from '../types';

interface SecondBrainPanelProps {
  brain: SecondBrainState;
}

export const SecondBrainPanel: React.FC<SecondBrainPanelProps> = ({ brain }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  // Filter nodes based on search and type
  const filteredNodes = brain.memoryGraph.nodes.filter(node => {
    const matchesSearch = !searchQuery || 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || node.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return '📄';
      case 'agent_output': return '🤖';
      case 'event': return '📊';
      case 'concept': return '💡';
      case 'code': return '💻';
      case 'conversation': return '💬';
      default: return '📎';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'file': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'agent_output': return 'bg-purple-900/50 text-purple-400 border-purple-700';
      case 'event': return 'bg-green-900/50 text-green-400 border-green-700';
      case 'concept': return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'code': return 'bg-cyan-900/50 text-cyan-400 border-cyan-700';
      case 'conversation': return 'bg-pink-900/50 text-pink-400 border-pink-700';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  // Group nodes by type for mobile view
  const nodesByType = filteredNodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = [];
    acc[node.type].push(node);
    return acc;
  }, {} as Record<string, MemoryNode[]>);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header - Mobile optimized */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <div>
              <h2 className="text-lg font-bold">Second Brain</h2>
              <p className="text-xs text-gray-400">
                {brain.stats.totalNodes} memories • {brain.stats.totalConnections} connections
              </p>
            </div>
          </div>
        </div>

        {/* Search - Full width on mobile */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="absolute right-3 top-3 text-gray-500">🔍</span>
        </div>

        {/* Type filters - Horizontal scroll on mobile */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              !selectedType ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            All ({brain.stats.totalNodes})
          </button>
          {Object.entries(brain.stats.memoryTypes).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedType === type ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <span>{getTypeIcon(type)}</span>
              <span className="capitalize">{type.replace('_', ' ')}</span>
              <span className="text-gray-400">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Memory Grid - Mobile optimized list view */}
      <div className="p-4">
        {filteredNodes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No memories found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNodes.slice(0, 20).map((node) => (
              <div
                key={node.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${getTypeColor(node.type)}`}
                onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getTypeIcon(node.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{node.title}</h3>
                    <p className="text-xs opacity-75 mt-1 line-clamp-2">
                      {node.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                      <span>
                        {new Date(node.metadata.createdAt).toLocaleDateString()}
                      </span>
                      {node.metadata.moduleId && (
                        <span className="px-1.5 py-0.5 bg-black/20 rounded">
                          {node.metadata.moduleId}
                        </span>
                      )}
                    </div>

                    {/* Expanded details */}
                    {expandedNode === node.id && (
                      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                        <div className="space-y-2 text-xs">
                          {node.metadata.agentId && (
                            <p><span className="opacity-60">Agent:</span> {node.metadata.agentId}</p>
                          )}
                          {node.metadata.fileType && (
                            <p><span className="opacity-60">Type:</span> {node.metadata.fileType}</p>
                          )}
                          {node.metadata.size && (
                            <p><span className="opacity-60">Size:</span> {(node.metadata.size / 1024).toFixed(1)} KB</p>
                          )}
                          {node.metadata.creditsUsed && (
                            <p><span className="opacity-60">Credits:</span> {node.metadata.creditsUsed}</p>
                          )}
                          {node.metadata.tags && node.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {node.metadata.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-black/20 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs opacity-50">
                    {expandedNode === node.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredNodes.length > 20 && (
              <p className="text-center text-xs text-gray-500 mt-4">
                +{filteredNodes.length - 20} more memories
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{filteredNodes.length} shown</span>
          <span>{brain.stats.totalConnections} connections</span>
        </div>
      </div>
    </div>
  );
};

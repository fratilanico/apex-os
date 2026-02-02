import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { Tool } from '../../types/curriculum';

interface ToolBadgeProps {
  toolId: string;
  tools: Tool[];
  size?: 'sm' | 'md';
}

/**
 * Small pill-style badge showing tool name and category
 * Color-coded by tier (core = cyan, asset = violet)
 * Hover shows full description
 */
export const ToolBadge: React.FC<ToolBadgeProps> = ({ toolId, tools, size = 'sm' }) => {
  const tool = tools.find(t => t.id === toolId);
  
  if (!tool) return null;

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Box;
  
  // Color classes based on tier
  const tierColors = {
    core: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20',
    asset: 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md border font-mono
        transition-all duration-200 cursor-default
        ${tierColors[tool.tier]}
        ${sizeClasses[size]}
      `}
      title={tool.description}
    >
      <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span className="uppercase tracking-wide">{tool.name}</span>
    </span>
  );
};

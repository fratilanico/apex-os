import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { TierBadge } from './TierBadge';
import type { Tool } from '../../../types/curriculum';

interface ToolWithRole extends Tool {
  role: string;
  subtitle: string;
  description: string;
}

interface ToolCardProps {
  tool: ToolWithRole;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  // Get the Lucide icon dynamically
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Box;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300"
    >
      {/* Tier Badge */}
      <TierBadge tier={tool.tier} />
      
      {/* Glow effect on hover */}
      <div 
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${tool.tier === 'core' 
            ? 'bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent' 
            : 'bg-gradient-to-br from-violet-500/10 via-transparent to-transparent'
          }
        `}
      />
      
      {/* Card Content */}
      <div className="relative p-6 h-full flex flex-col">
        {/* Icon */}
        <div className={`
          mb-4 w-12 h-12 rounded-lg flex items-center justify-center
          ${tool.tier === 'core' 
            ? 'bg-cyan-500/10 text-cyan-400' 
            : 'bg-violet-500/10 text-violet-400'
          }
        `}>
          <IconComponent className="w-6 h-6" />
        </div>
        
        {/* Role (large, bold) */}
        <h3 className="text-xl font-bold text-white mb-1">
          {tool.role}
        </h3>
        
        {/* Subtitle (muted) */}
        <p className="text-sm text-zinc-400 mb-3">
          {tool.subtitle}
        </p>
        
        {/* Tool Name */}
        <p className={`
          text-xs font-semibold uppercase tracking-wider mb-4
          ${tool.tier === 'core' ? 'text-cyan-400' : 'text-violet-400'}
        `}>
          {tool.name}
        </p>
        
        {/* Description - Expands on hover */}
        <div className="mt-auto">
          <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300 line-clamp-3 group-hover:line-clamp-none">
            {tool.description}
          </p>
        </div>
      </div>
      
      {/* Border glow effect */}
      <div 
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
          ${tool.tier === 'core' 
            ? 'shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
            : 'shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          }
        `}
      />
    </motion.div>
  );
}

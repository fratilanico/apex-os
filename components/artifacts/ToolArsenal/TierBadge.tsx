import type { ToolTier } from '../../../types/curriculum';

interface TierBadgeProps {
  tier: ToolTier;
}

export function TierBadge({ tier }: TierBadgeProps) {
  const isCORE = tier === 'core';
  
  return (
    <div
      className={`
        absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold tracking-wider
        backdrop-blur-sm border
        ${isCORE 
          ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300' 
          : 'bg-violet-500/20 border-violet-400/30 text-violet-300'
        }
      `}
    >
      {isCORE ? 'CORE' : 'ASSET'}
    </div>
  );
}

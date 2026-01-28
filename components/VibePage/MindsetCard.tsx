import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface MindsetCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  status: 'deprecated' | 'limited' | 'current';
  delay?: number;
}

export const MindsetCard: React.FC<MindsetCardProps> = ({
  number,
  title,
  description,
  icon: Icon,
  features,
  status,
}) => {
  const statusConfig = {
    deprecated: {
      border: 'border-red-500/20 hover:border-red-500/30',
      bg: 'bg-red-500/5',
      badge: 'bg-red-500/10 text-red-400',
      icon: 'bg-red-500/10 border-red-500/20 text-red-400',
    },
    limited: {
      border: 'border-yellow-500/20 hover:border-yellow-500/30',
      bg: 'bg-yellow-500/5',
      badge: 'bg-yellow-500/10 text-yellow-400',
      icon: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    },
    current: {
      border: 'border-cyan-500/20 hover:border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      badge: 'bg-cyan-500/10 text-cyan-400',
      icon: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`rounded-xl p-5 md:p-6 ${config.border} ${config.bg} border relative overflow-hidden transition-colors duration-200`}
    >
      {/* Number Badge */}
      <div className="absolute top-4 right-4 inline-flex w-8 h-8 rounded-full bg-black/40 border border-white/10 items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-white/50">{number}</span>
      </div>

      {/* Icon */}
      <div className={`inline-flex w-10 h-10 md:w-12 md:h-12 rounded-lg ${config.icon} border items-center justify-center mb-4 flex-shrink-0`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold text-white mb-1">{title}</h3>
      
      {/* Status Badge */}
      <div className={`inline-block px-2 py-0.5 rounded-full ${config.badge} text-[10px] font-mono uppercase mb-3`}>
        {status}
      </div>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-4">{description}</p>

      {/* Features */}
      <div className="space-y-2">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <ArrowRight className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-white/60">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

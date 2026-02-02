import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TimelineStepProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  details: string[];
  isLast?: boolean;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  step,
  title,
  description,
  icon: Icon,
  details,
  isLast = false,
}) => {
  return (
    <div className="relative flex gap-4 md:gap-6">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-5 md:left-6 top-12 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 to-transparent" />
      )}

      {/* Icon Circle */}
      <div className="relative z-10 flex-shrink-0">
        <div className="inline-flex w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 items-center justify-center">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 flex-shrink-0" strokeWidth={2} />
        </div>
        <div className="absolute -top-1 -right-1 inline-flex w-4 h-4 md:w-5 md:h-5 rounded-full bg-black border border-cyan-500/50 items-center justify-center">
          <span className="text-[9px] md:text-[10px] font-bold text-cyan-400">{step}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-8 md:pb-10">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/50 mb-3">{description}</p>
        
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span className="text-sm text-white/60">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Check } from 'lucide-react';

interface DiffViewProps {
  oldWay: {
    title: string;
    description: string;
    points: string[];
  };
  newWay: {
    title: string;
    description: string;
    points: string[];
  };
}

export const DiffView: React.FC<DiffViewProps> = ({ oldWay, newWay }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
      {/* Old Way - Red Tinted */}
      <div
        className="rounded-xl p-5 md:p-6 border border-red-500/20 bg-red-500/5"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/10 flex-shrink-0">
            <X className="w-4 h-4 text-red-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{oldWay.title}</h3>
            <p className="text-xs text-red-400/80 font-mono">DEPRECATED</p>
          </div>
        </div>
        
        <p className="text-sm text-white/60 mb-4 leading-relaxed">{oldWay.description}</p>
        
        <div className="space-y-2">
          {oldWay.points.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-white/60">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Way - Cyan Tinted */}
      <div
        className="rounded-xl p-5 md:p-6 border border-cyan-500/20 bg-cyan-500/5"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 flex-shrink-0">
            <Check className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{newWay.title}</h3>
            <p className="text-xs text-cyan-400 font-mono">CURRENT</p>
          </div>
        </div>
        
        <p className="text-sm text-white/60 mb-4 leading-relaxed">{newWay.description}</p>
        
        <div className="space-y-2">
          {newWay.points.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-white/60">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

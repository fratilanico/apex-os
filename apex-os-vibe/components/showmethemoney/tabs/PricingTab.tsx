import React from 'react';

export const PricingTab: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pricing Strategy</h2>
        <p className="text-white/60">Dual-market approach for global reach</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CodeSprint */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-cyan-400 mb-2">$89/mo</div>
          <div className="text-white font-bold mb-4">CodeSprint</div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>Core curriculum</li>
            <li>Community access</li>
            <li>Weekly Q&A</li>
          </ul>
        </div>

        {/* Builder Lab */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-violet-400 mb-2">$149/mo</div>
          <div className="text-white font-bold mb-4">Builder Lab</div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>Everything in CodeSprint</li>
            <li>1:1 mentoring</li>
            <li>Priority support</li>
          </ul>
        </div>

        {/* Founder Track */}
        <div className="p-6 rounded-2xl bg-white/5 border border-emerald-500/30 ring-2 ring-emerald-500/20">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Recommended</div>
          <div className="text-2xl font-bold text-emerald-400 mb-2">$249/mo</div>
          <div className="text-white font-bold mb-4">Founder Track</div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>Unlimited mentoring</li>
            <li>Accelerator access</li>
            <li>Investor introductions</li>
          </ul>
        </div>

        {/* Accelerator */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400 mb-2">$300</div>
          <div className="text-white font-bold mb-4">Accelerator</div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>4-week intensive</li>
            <li>Demo day prep</li>
            <li>15% equity option</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingTab;

import React from 'react';
import { Search, Hammer, Zap } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Deconstruct",
    desc: "We strip away the noise. Understanding a system starts with breaking it down into its most fundamental atomic truths.",
    color: "from-violet-500/20"
  },
  {
    icon: Hammer,
    title: "Rebuild",
    desc: "With precision and intent, we reconstruct logic. Not just to make it work, but to make it scalable and resilient.",
    color: "from-emerald-500/20"
  },
  {
    icon: Zap,
    title: "Flow",
    desc: "The final state. Where engineering meets intuition. We build interfaces that feel alive, reactive, and fluid.",
    color: "from-indigo-500/20"
  }
];

export const Philosophy = React.memo(function Philosophy() {
  return (
    <section id="approach" className="py-20 space-y-16">
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-5xl font-bold tracking-tight">The Curriculum Approach</h2>
        <p className="text-white/50 text-xl font-medium">My philosophy is built on the intersection of technical excellence and organic human experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="group relative"
          >
            <div className={`absolute -inset-4 bg-gradient-to-br ${step.color} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative space-y-6">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-white/5 border border-white/10 items-center justify-center group-hover:border-white/30 transition-all duration-300 flex-shrink-0">
                <step.icon className="w-7 h-7 text-white flex-shrink-0" strokeWidth={2} />
              </div>
              <h3 className="text-3xl font-bold text-white">{step.title}</h3>
              <p className="text-white/50 leading-relaxed text-lg">{step.desc}</p>
              
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />
              <div className="mono text-[10px] text-white/30 uppercase tracking-[0.3em]">Phase 0{idx + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

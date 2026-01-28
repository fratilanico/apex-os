import React from 'react';
import { GitBranch, Terminal, Box, ArrowRight } from 'lucide-react';

interface CurriculumProps {
  onOpenCurriculum: () => void;
}

export const Curriculum = React.memo<CurriculumProps>(function Curriculum({ onOpenCurriculum }) {
  const modules = [
    {
      title: "Module 01: The Environment",
      desc: "Setting up a local LLM toolchain. Installing Cursor, configuring API keys, and understanding the context window.",
      icon: Box
    },
    {
      title: "Module 02: Prompt Engineering",
      desc: "Moving from 'chatting' to 'specifying'. How to write prompts that result in production-grade code, not just snippets.",
      icon: Terminal
    },
    {
      title: "Module 03: Agent Orchestration",
      desc: "Building loops. How to make OpenCode and Claude work together to solve problems that require multiple steps and file edits.",
      icon: GitBranch
    }
  ];

  return (
    <section 
      onClick={onOpenCurriculum}
      className="py-24 px-4 max-w-4xl mx-auto relative cursor-pointer group transition-opacity hover:opacity-90"
    >
      {/* Connecting Line */}
      <div className="absolute left-8 top-32 bottom-32 w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 hidden md:block" />

      <div className="space-y-16">
        <div className="text-center md:text-left md:pl-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Learning Path</h2>
          <p className="text-white/50">From zero to autonomous engineer in three phases.</p>
        </div>

        <div className="space-y-12">
          {modules.map((mod, idx) => (
            <div 
              key={idx}
              className="relative flex gap-8 items-start group"
            >
              {/* Timeline Node */}
              <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-black border border-cyan-500/50 group-hover:bg-cyan-500 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 z-10" />
              </div>

              <div className="glass-card p-8 rounded-xl flex-1 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{mod.title}</h3>
                </div>
                <p className="text-white/60 leading-relaxed pl-14">
                  {mod.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 md:pl-20">
          <button className="text-cyan-400 text-sm font-mono hover:text-cyan-300 transition-colors flex items-center gap-2 mx-auto">
            Click anywhere to explore full curriculum
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
});

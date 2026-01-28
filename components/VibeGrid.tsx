
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Music, Globe, Cpu, Zap, Radio } from 'lucide-react';

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`relative group rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 backdrop-blur-md overflow-hidden p-8 hover:-translate-y-2 transition-transform duration-200 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ willChange: 'opacity' }} />
      <div className="absolute inset-px rounded-[2rem] border border-white/5 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const VibeGrid: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const stack = ["React 19", "Three.js", "Framer", "Go", "WebGL", "GenAI", "Tailwind"];

  return (
    <section id="vibe" className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
      {/* Primary Academy Card */}
      <Card id="academy" className="md:col-span-3 lg:col-span-8 min-h-[340px]" delay={0.1}>
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-500/20 items-center justify-center border border-emerald-500/30 flex-shrink-0">
              <GraduationCap className="text-emerald-400 w-7 h-7 flex-shrink-0" strokeWidth={2} />
            </div>
            <div>
              <p className="mono text-[10px] text-white/40 uppercase tracking-[0.2em]">Affiliation</p>
              <h4 className="text-white font-black text-xl">InfoAcademy</h4>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="mono text-[9px] text-white/60 uppercase">Senior Instructor</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter">
            Architecting <br />Digital Fluency.
          </h3>
          <p className="text-white/40 text-lg max-w-xl leading-relaxed">
            I lead the curriculum design at InfoAcademy, focusing on the bridge between raw algorithmic logic and high-end aesthetic experiences.
          </p>
        </div>
      </Card>

      {/* Live Status / Mood */}
      <Card className="md:col-span-3 lg:col-span-4" delay={0.2}>
        <div className="flex justify-between items-start mb-12">
          <Radio className="text-violet-400 w-6 h-6 animate-pulse" />
          <div className="text-right">
            <p className="mono text-[10px] text-white/40 uppercase tracking-widest">Zone</p>
            <p className="text-white font-bold">Berlin / UTC+1</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Current Vibe</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold text-white tracking-tight">Deep Work</h3>
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
          
          <div className="flex gap-1.5 h-12 items-end" aria-hidden="true">
            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 1.0, 0.5, 0.7].map((val, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: val }}
                animate={
                  prefersReducedMotion
                    ? { scaleY: val }
                    : { scaleY: [val, 1 - val, val] }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 2, repeat: Infinity, delay: i * 0.1 }
                }
                className="flex-1 origin-bottom bg-gradient-to-t from-violet-500/40 to-emerald-500/40 rounded-full"
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Tech Constellation */}
      <Card className="md:col-span-2 lg:col-span-4 flex flex-col justify-between" delay={0.3}>
        <div>
          <div className="inline-flex w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center mb-6 flex-shrink-0">
            <Cpu className="text-white w-5 h-5 flex-shrink-0" strokeWidth={2} />
          </div>
          <h4 className="text-xl font-bold text-white mb-4">Core Stack</h4>
          <div className="flex flex-wrap gap-2">
            {stack.map(s => (
              <span key={s} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest hover:border-emerald-500/50 hover:text-white transition-all">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Audio / Pulse */}
      <Card className="md:col-span-4 lg:col-span-8 group/music" delay={0.4}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 p-1">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-black/20 flex items-center justify-center">
                <Music className="text-white w-12 h-12 group-hover/music:scale-110 transition-transform duration-500" />
              </div>
            </div>
            {/* Spinning ring decorative */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-white/10 rounded-full pointer-events-none"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 mono text-[9px] uppercase tracking-widest mb-3">
              Now Playing
            </div>
            <h3 className="text-3xl font-black text-white mb-1 tracking-tight">Cyber-Symphony No. 4</h3>
            <p className="text-white/40 font-medium">Synthetic Vibe Collective • 4:20</p>
            
            <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0.65 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, delay: 1 }}
                className="h-full origin-left bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-center gap-2">
            <Globe className="w-5 h-5 text-white/20" />
            <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </Card>
    </section>
  );
};

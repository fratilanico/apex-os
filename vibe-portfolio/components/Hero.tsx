import React from 'react';
import { Terminal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DeploymentDemo } from './artifacts/DeploymentDemo';

interface HeroProps {
  onOpenCurriculum?: () => void;
}

export const Hero = React.memo<HeroProps>(function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-12">
      
      {/* CodeMachine-style Terminal Header */}
      <div 
        className="mb-8 font-mono text-sm text-cyan-400/80 bg-cyan-950/10 border border-cyan-900/30 rounded-md px-4 py-2 flex items-center gap-2 animate-fade-in-up"
      >
        <Terminal className="w-4 h-4" />
        <span className="typing-effect"> initializing_curriculum --stack=modern</span>
        <span className="w-2 h-4 bg-cyan-400 animate-pulse"/>
      </div>

      <h1 
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 animate-fade-in-up animation-delay-100 max-w-5xl"
      >
        Your $200K Technical Co-Founder <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          Just Became $200/Month
        </span>
      </h1>

      <p 
        className="max-w-3xl text-lg md:text-xl text-white/60 mb-12 leading-relaxed font-light animate-fade-in-up animation-delay-200"
      >
        Build production-grade features without hiring engineers. <br className="hidden sm:block" />
        Master the agent stack that lets non-technical founders ship faster than 10-person dev teams.
      </p>

      {/* Interactive Deployment Demo */}
      <div className="w-full max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-300">
        <DeploymentDemo />
      </div>

      {/* CTA */}
      <div className="animate-fade-in-up animation-delay-400">
        <Link
          to="/academy"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-lg"
        >
          <span>Start Building Your AI Team</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        
        <p className="mt-4 text-sm text-white/40">
          No equity given. No salary negotiation. No risk they quit.
        </p>
      </div>

    </section>
  );
});

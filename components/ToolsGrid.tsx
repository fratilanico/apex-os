import React from 'react';
import { 
  Code2,
  Bot,
  Sparkles,
  Cloud,
  Rocket,
  Workflow,
  BookOpen,
  Palette,
  Bug,
  Terminal,
  Image,
  Video,
} from 'lucide-react';

const ToolCard: React.FC<{
  title: string;
  desc: string;
  icon: React.ElementType;
  tech: string;
  delay: number;
}> = ({ title, desc, icon: Icon, tech }) => (
  <div
    className="glass-card rounded-xl p-6 relative group overflow-hidden"
  >
    <div className="absolute top-4 right-4 text-xs font-mono text-white/20 group-hover:text-cyan-400 transition-colors">
      {tech}
    </div>
    
    <div className="inline-flex w-12 h-12 rounded-lg bg-white/5 items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors flex-shrink-0">
      {React.createElement(Icon as any, {
        className: "w-6 h-6 text-white/80 group-hover:text-cyan-400 transition-colors flex-shrink-0",
        strokeWidth: 2
      })}
    </div>
    
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
  </div>
);

export const ToolsGrid = React.memo(function ToolsGrid() {
  const coreTools = [
    {
      title: "Cursor",
      desc: "The AI-native editor. Flow state is not just a feeling; it's a feature. Tab-complete entire functions with full codebase embedding.",
      icon: Code2,
      tech: "EDITOR",
      delay: 0.1
    },
    {
      title: "Claude Code",
      desc: "The reasoning engine. Hand off complex refactoring and architectural decisions to the smartest model available. 72.7% SWE-Bench verified.",
      icon: Bot,
      tech: "REASONING",
      delay: 0.15
    },
    {
      title: "Gemini 2.5",
      desc: "The multimodal powerhouse. 1M token context, processes screenshots/PDFs/videos, 2x faster than competitors. Real-time Google Search grounding.",
      icon: Sparkles,
      tech: "MULTIMODAL",
      delay: 0.2
    },
    {
      title: "OpenAI Codex",
      desc: "Cloud agent for async parallel tasks. Spec-to-code workflows with AGENTS.md configuration. Perfect for distributed build systems.",
      icon: Cloud,
      tech: "CLOUD",
      delay: 0.25
    },
    {
      title: "Antigravity",
      desc: "Google's agentic development platform. VS Code fork with Claude Code extension built-in. Unified environment for AI-first development.",
      icon: Rocket,
      tech: "IDE",
      delay: 0.3
    },
    {
      title: "CodeMachine",
      desc: "The orchestrator. Multi-agent systems that turn specifications into production-ready software. 90% self-built capability.",
      icon: Workflow,
      tech: "ORCHESTRATION",
      delay: 0.35
    }
  ];

  const assetTools = [
    {
      title: "NotebookLM",
      desc: "Multi-document synthesis engine. Upload 50+ sources, generate podcasts, mind maps, infographics, and slide decks. 80+ languages supported.",
      icon: BookOpen,
      tech: "RESEARCH",
      delay: 0.4
    },
    {
      title: "Google Stitch",
      desc: "AI UI generation for mobile and web applications. Design ideation at the speed of thought. From prompt to pixel-perfect mockups.",
      icon: Palette,
      tech: "DESIGN",
      delay: 0.45
    },
    {
      title: "GPT-5.2",
      desc: "The debugging specialist. 80% accuracy on SWE-Bench debugging tasks. 30% fewer hallucinations. Root cause analysis from error logs.",
      icon: Bug,
      tech: "DEBUGGING",
      delay: 0.5
    },
    {
      title: "OpenCode",
      desc: "Open-source autonomous agent framework. Multi-provider support, MCP integration. Build agents that read, write, and execute code.",
      icon: Terminal,
      tech: "AGENT",
      delay: 0.55
    },
    {
      title: "Imagen 3",
      desc: "State-of-the-art image generation. Photorealism to abstract art. Style customization, mask-based editing, brand-consistent visuals.",
      icon: Image,
      tech: "IMAGES",
      delay: 0.6
    },
    {
      title: "Veo 3.1",
      desc: "Cinematography-aware video generation. 4K output up to minutes in length. Native audio, improved physics, human movement.",
      icon: Video,
      tech: "VIDEO",
      delay: 0.65
    }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Autonomous Stack</h2>
        <p className="text-white/50 max-w-2xl text-lg">
          We don't teach syntax. We teach how to wield the tools that write the syntax for you.
        </p>
      </div>

      {/* Core Stack */}
      <div className="mb-20">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Core Stack
          </h3>
          <p className="text-white/40 text-sm">
            Your daily drivers for autonomous development
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>
      </div>

      {/* Asset & Research Layer */}
      <div>
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400"></span>
            Asset & Research Layer
          </h3>
          <p className="text-white/40 text-sm">
            Specialized tools for content, debugging, and design
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetTools.map((tool, idx) => (
            <ToolCard key={idx} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
});

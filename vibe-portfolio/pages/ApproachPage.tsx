import React from 'react';
import { Search, Workflow, CheckCircle2, ArrowRight } from 'lucide-react';
import { DiffView, TimelineStep, TerminalSimulator } from '../components/ApproachPage';
import { ParadigmShifter } from '../components/artifacts/ParadigmShifter/ParadigmShifter';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const ApproachPage: React.FC = () => {
  const mindsetComparison = {
    oldWay: {
      title: 'Autocomplete Mindset',
      description: 'AI suggests the next line. You hit tab. Repeat. You\'re still the bottleneck.',
      points: [
        'AI is just a faster keyboard',
        'You write every function manually',
        'No delegation of complex tasks',
        'Doesn\'t scale beyond typing speed',
      ],
    },
    newWay: {
      title: 'Orchestrator Mindset',
      description: 'Define what needs to be built. Route tasks to specialized agents. Watch them collaborate.',
      points: [
        'Design systems, not write code',
        'Specialized agents work in parallel',
        'Automatic handoffs and verification',
        'You architect, not micromanage',
      ],
    },
  };

  const chatbotComparison = {
    oldWay: {
      title: 'Chatbot Mindset',
      description: 'Generate code, review it, find issues, ask for fixes. Six iterations later, it works.',
      points: [
        'Manual oversight for every task',
        'Loses context after 10 messages',
        'You\'re the project manager',
        'Every iteration needs prompting',
      ],
    },
    newWay: {
      title: 'Multi-Agent System',
      description: 'Product Agent → Frontend Agent → Backend Agent → QA Agent → Review Agent. Set up once.',
      points: [
        'Agents verify each other\'s work',
        'Parallel execution saves hours',
        'Context persists across handoffs',
        'You review output, not every step',
      ],
    },
  };

  const timelineSteps = [
    {
      step: 1,
      title: 'Research',
      icon: Search,
      description: 'Understand the problem space with AI-powered context synthesis.',
      details: [
        'Upload specs, docs, and existing codebase to models with 200K+ context windows',
        'Let AI map out dependencies, edge cases, and technical constraints',
        'Generate architectural decision records automatically',
        'Time saved: 60% compared to manual documentation review',
      ],
    },
    {
      step: 2,
      title: 'Orchestrate',
      icon: Workflow,
      description: 'Route tasks to specialized agents based on the cost-quality-speed triangle.',
      details: [
        'Database schema → Claude Sonnet (quality-critical)',
        'UI components → Gemini Flash (speed + cost optimized)',
        'Complex logic → Claude Sonnet (quality-critical)',
        'Bug fixing → GPT-5.2 (specialized debugging)',
      ],
    },
    {
      step: 3,
      title: 'Verify',
      icon: CheckCircle2,
      description: 'Automated quality gates ensure correctness before human review.',
      details: [
        'Run test suites automatically after code generation',
        'Type checking and linting integrated into agent workflows',
        'Cross-agent verification (QA agent reviews code from other agents)',
        'Only surface results when all checks pass',
      ],
    },
  ];

  const costComparison = {
    scenario: 'Todo App - Add Tags Feature',
    allClaude: 6.0,
    optimized: 2.4,
    savings: 60,
    breakdown: [
      { task: 'Database Schema', tool: 'Claude', cost: '$0.60' },
      { task: 'API Endpoints', tool: 'Gemini', cost: '$0.15' },
      { task: 'React Components', tool: 'Gemini', cost: '$0.30' },
      { task: 'Search Logic', tool: 'Claude', cost: '$0.90' },
      { task: 'Type Error Debug', tool: 'GPT-5.2', cost: '$0.45' },
    ],
  };

  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-5xl mx-auto pb-16">
      {/* Hero Section - Compact */}
      <section className="text-center max-w-3xl mx-auto pt-4 pb-12">
        <p className="text-sm font-medium text-white/60 mb-2 animate-fade-in">
          The proven framework for AI-augmented development.
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 animate-fade-in-up animation-delay-100">
          From Syntax Generation to System Architecture
        </h1>
        <p className="text-base text-white/50 animate-fade-in animation-delay-200">
          Most founders get stuck in the autocomplete or chatbot mindset. Here's why orchestration changes everything.
        </p>
      </section>

      {/* Section 0: ParadigmShifter - Interactive Toggle */}
      <section className="pb-12">
        <ErrorBoundary>
          <ParadigmShifter />
        </ErrorBoundary>
      </section>

      {/* Section 1: Mindset Comparison */}
      <section className="pb-12">
        <DiffView oldWay={mindsetComparison.oldWay} newWay={mindsetComparison.newWay} />
      </section>

      {/* Section 2: Chatbot vs Multi-Agent */}
      <section className="pb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Single Agent vs Multi-Agent Systems
          </h2>
          <p className="text-sm text-white/50">
            The chatbot mindset keeps you in the loop for every decision. Multi-agent systems work while you sleep.
          </p>
        </div>
        <DiffView oldWay={chatbotComparison.oldWay} newWay={chatbotComparison.newWay} />
      </section>

      {/* Section 3: The Three-Phase Framework */}
      <section className="pb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Three-Phase Workflow
          </h2>
          <p className="text-sm text-white/50">
            Every successful AI-augmented project follows this pattern.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {timelineSteps.map((step, idx) => (
            <TimelineStep
              key={step.step}
              {...step}
              isLast={idx === timelineSteps.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Cost Optimization */}
      <section className="pb-12">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The 60% Cost Savings Formula
          </h2>
          <p className="text-sm text-white/50">
            Use Claude for 20% of tasks (quality-critical). Use Gemini for 80% (speed + cost).
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <TerminalSimulator comparison={costComparison} />
        </div>

        {/* Cost Triangle - Compact */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4">The Cost-Quality-Speed Triangle</h3>
          <p className="text-sm text-white/50 mb-6">
            You can optimize for any two vertices, but never all three simultaneously.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="text-cyan-400 font-mono text-xs mb-1">QUALITY</div>
              <div className="text-sm text-white/60">Claude Sonnet: 72.7% SWE-Bench</div>
            </div>
            <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
              <div className="text-violet-400 font-mono text-xs mb-1">SPEED</div>
              <div className="text-sm text-white/60">Gemini Flash: 2x faster</div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="text-emerald-400 font-mono text-xs mb-1">COST</div>
              <div className="text-sm text-white/60">Gemini: $0.075 per 1M tokens</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant cyan link style */}
      <section className="text-center py-12 border-t border-white/5">
        <h2 className="text-xl font-bold text-white mb-2">
          Ready to Master AI Orchestration?
        </h2>
        <p className="text-sm text-white/50 mb-6">
          Learn the exact workflows and cost optimization strategies.
        </p>
        <Link 
          to="/academy"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          <span>View Full Curriculum</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
};

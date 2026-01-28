import React from 'react';
import { Mail, Calendar, Linkedin, ArrowRight } from 'lucide-react';
import { FAQAccordion } from '../components/ContactPage';
import { TerminalContactV2 } from '../components/artifacts/TerminalContact/TerminalContactV2';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const ContactPage: React.FC = () => {
  const faqs = [
    {
      question: 'Who is this curriculum for?',
      answer: 'Founders and technical leaders who want to ship faster with AI. You should have basic coding knowledge and be comfortable with the terminal. If you\'ve built a feature before (any language), you\'re ready.',
    },
    {
      question: 'How is this different from learning ChatGPT prompts?',
      answer: 'ChatGPT tutorials teach you to prompt better. We teach you to orchestrate systems. You\'ll learn when to use Claude vs Gemini vs GPT, how to set up multi-agent workflows, and how to verify output automatically.',
    },
    {
      question: 'Do I need to know how to code?',
      answer: 'Basic coding knowledge helps, but you don\'t need to be a senior engineer. If you can read code and follow technical documentation, you\'ll be fine. The curriculum focuses on orchestration, not manual coding.',
    },
    {
      question: 'What tools do I need?',
      answer: 'You\'ll need accounts for the 12 tools in the stack. Most have free tiers to start. Total cost: ~$20-50/month if you use the free tiers strategically.',
    },
    {
      question: 'How long does it take to complete?',
      answer: 'The core curriculum is ~20 hours. Most people complete it in 2-3 weeks. The final practicum (Module 05) is self-paced and typically takes 2-4 weeks.',
    },
    {
      question: 'Do you offer certification?',
      answer: 'Yes. After completing the practicum (Module 05), you submit your project for mentor review. Once approved, you receive a Vibe Coder Academy certificate.',
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'For general inquiries',
      action: 'vibe@infoacademy.ro',
      link: 'mailto:vibe@infoacademy.ro',
    },
    {
      icon: Calendar,
      title: 'Book a Call',
      description: 'Discuss custom training',
      action: 'Schedule 30 min',
      link: '#',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Connect with us',
      action: 'Follow InfoAcademy',
      link: '#',
    },
  ];

  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-4xl mx-auto pb-16">
      {/* Hero Section - Compact */}
      <section className="text-center max-w-2xl mx-auto pt-4 pb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 animate-fade-in-up">
          Let's Build{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
            Together
          </span>
        </h1>
        <p className="text-sm text-white/50 animate-fade-in animation-delay-100">
          Questions about the curriculum? Want to discuss custom training? We're here to help.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="pb-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.title}
                href={method.link}
                className="p-4 rounded-lg border border-white/10 bg-white/[0.04] hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all text-center group"
              >
                <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-0.5">{method.title}</h3>
                <p className="text-xs text-white/40 mb-2">{method.description}</p>
                <span className="text-xs text-cyan-400 font-mono">{method.action}</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-10">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-white/50">
            Everything you need to know about the curriculum.
          </p>
        </div>
        <FAQAccordion items={faqs} />
      </section>

      {/* Terminal Contact Form */}
      <section className="pb-10">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Initialize Contact Protocol
          </h2>
          <p className="text-sm text-white/50">
            Secure terminal interface. Type responses and press ENTER. All prompts use markdown format.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <ErrorBoundary>
            <TerminalContactV2 />
          </ErrorBoundary>
        </div>
      </section>

      {/* CTA - Elegant cyan link */}
      <section className="text-center py-10 border-t border-white/5">
        <h2 className="text-lg font-bold text-white mb-2">
          Ready to Start Learning?
        </h2>
        <p className="text-sm text-white/50 mb-4">
          Explore the curriculum or jump straight into Module 00.
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link 
            to="/academy"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <span>View Academy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/"
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
};

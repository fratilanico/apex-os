import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  Shield,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Timer,
} from 'lucide-react';

type BillingPeriod = 'monthly' | 'lifetime';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface ComparisonRow {
  feature: string;
  vibeAcademy: string;
  techCofounder: string;
  devAgency: string;
}

const planFeatures: PlanFeature[] = [
  { text: 'Full 6-module curriculum (20+ hours)', included: true },
  { text: 'Access to all 12 AI tools training', included: true },
  { text: 'Hands-on projects with real codebases', included: true },
  { text: 'Multi-agent orchestration mastery', included: true },
  { text: 'Private Discord community access', included: true },
  { text: 'Weekly live Q&A sessions', included: true },
  { text: 'Certificate of completion', included: true },
  { text: 'Lifetime curriculum updates', included: true },
  { text: '1-on-1 coaching calls (2x/month)', included: true },
  { text: 'Code review on your projects', included: true },
];

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Upfront Cost',
    vibeAcademy: '$200/mo or $997',
    techCofounder: '$0 (equity)',
    devAgency: '$15,000+',
  },
  {
    feature: 'Annual Cost',
    vibeAcademy: '$997-$2,400',
    techCofounder: '$150K-$300K',
    devAgency: '$50K-$200K',
  },
  {
    feature: 'Equity Required',
    vibeAcademy: '0%',
    techCofounder: '15-50%',
    devAgency: '0%',
  },
  {
    feature: 'Time to Start',
    vibeAcademy: 'Immediate',
    techCofounder: '3-12 months',
    devAgency: '2-4 weeks',
  },
  {
    feature: 'Knowledge Transfer',
    vibeAcademy: 'You learn everything',
    techCofounder: 'Dependent on them',
    devAgency: 'None',
  },
  {
    feature: 'Ongoing Dependency',
    vibeAcademy: 'None - you own it',
    techCofounder: 'High risk if they leave',
    devAgency: 'Vendor lock-in',
  },
  {
    feature: '24/7 Availability',
    vibeAcademy: 'AI agents work anytime',
    techCofounder: 'Limited hours',
    devAgency: 'Business hours only',
  },
  {
    feature: 'Scalability',
    vibeAcademy: 'Unlimited parallel agents',
    techCofounder: '1 person bandwidth',
    devAgency: 'Hourly billing',
  },
];

export const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<BillingPeriod>('monthly');

  const price = billing === 'monthly' ? '$200' : '$997';
  const period = billing === 'monthly' ? '/month' : ' one-time';

  return (
    <main className="relative z-10 px-3 sm:px-4 lg:px-6 max-w-6xl mx-auto pb-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-6 sm:pt-8 pb-8 sm:pb-12">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4 sm:mb-6"
        >
          <Timer className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-amber-400">
            Next cohort starts Feb 1 - Only 8 spots left
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6"
        >
          <span className="text-white">Invest in </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
            Your Independence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
        >
          Stop paying $200K/year for a tech co-founder or giving away equity.
          <br />
          <span className="text-white/80 font-semibold">
            Build your own AI engineering team for a fraction of the cost.
          </span>
        </motion.p>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 px-2 sm:px-0"
        >
          <div className="flex items-center gap-2 text-white/60">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">500+ founders enrolled</span>
          </div>
        </motion.div>
      </section>

      {/* Billing Toggle */}
      <section className="max-w-md mx-auto mb-8 sm:mb-12 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {/* Discount callout for mobile - shown above buttons */}
          <div className="sm:hidden text-center">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-[10px] font-bold text-emerald-400">
                SAVE 58% ($1,403)
              </span>
            </motion.div>
          </div>

          {/* Toggle buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <button
              onClick={() => setBilling('monthly')}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all min-h-[44px] ${
                billing === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('lifetime')}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all relative min-h-[44px] ${
                billing === 'lifetime'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Lifetime
              {/* Desktop badge - shown on top right */}
              <span className="hidden sm:block absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/50">
                SAVE 58%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Card */}
      <section className="max-w-lg mx-auto mb-12 sm:mb-16 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-violet-500/10 p-4 sm:p-6 md:p-8 overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px]" />

          <div className="relative">
            {/* Plan Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                  {billing === 'lifetime' ? 'LIFETIME ACCESS' : 'FULL ACCESS'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Vibe Coder Academy</h2>
              
              {/* Price display with strikethrough for lifetime */}
              {billing === 'lifetime' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl sm:text-2xl font-semibold text-white/40 line-through">
                      $2,400
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full">
                      -58%
                    </span>
                  </div>
                  {/* Price container with fixed width and overflow handling */}
                  <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 min-h-[3.5rem] sm:min-h-[4rem]">
                    <motion.span
                      key={price}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="inline-block max-w-[200px] overflow-hidden text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {price}
                    </motion.span>
                    <span className="w-full text-center text-white/60 text-sm sm:text-base sm:w-auto sm:text-left">
                      {period}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-emerald-400 font-bold">
                      You save $1,403 vs. monthly
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 min-h-[3.5rem] sm:min-h-[4rem]">
                  {/* Price container with fixed width and overflow handling */}
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="inline-block max-w-[200px] overflow-hidden text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {price}
                  </motion.span>
                  <span className="w-full text-center text-white/60 text-sm sm:text-base sm:w-auto sm:text-left">
                    {period}
                  </span>
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {planFeatures.map((feature, idx) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  {feature.included ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400/50 flex-shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-xs sm:text-sm ${
                      feature.included ? 'text-white/80' : 'text-white/40 line-through'
                    }`}
                  >
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link
                to="/contact"
                className="block w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-center text-base sm:text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all min-h-[48px] flex items-center justify-center"
              >
                Start Learning Today
              </Link>
              <p className="text-center text-[10px] sm:text-xs text-white/40 mt-3">
                Secure checkout. Cancel anytime for monthly plans.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Comparison Table */}
      <section className="mb-12 sm:mb-16 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            Compare Your Options
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            See how Vibe Academy stacks up against traditional paths
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="overflow-x-auto -mx-2 sm:-mx-0"
        >
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 sm:p-4 text-white/60 font-medium text-xs sm:text-sm border-b border-white/10">
                  Feature
                </th>
                <th className="p-3 sm:p-4 text-xs sm:text-sm border-b border-white/10">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 font-bold">
                      Vibe Academy
                    </span>
                    <span className="text-emerald-400 text-[10px] sm:text-xs">Recommended</span>
                  </div>
                </th>
                <th className="p-3 sm:p-4 text-white/60 font-medium text-xs sm:text-sm border-b border-white/10">
                  Tech Co-Founder
                </th>
                <th className="p-3 sm:p-4 text-white/60 font-medium text-xs sm:text-sm border-b border-white/10">
                  Dev Agency
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + idx * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-3 sm:p-4 text-white/80 text-xs sm:text-sm font-medium">{row.feature}</td>
                  <td className="p-3 sm:p-4 text-center">
                    <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                      {row.vibeAcademy}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-center text-white/50 text-xs sm:text-sm">
                    {row.techCofounder}
                  </td>
                  <td className="p-3 sm:p-4 text-center text-white/50 text-xs sm:text-sm">{row.devAgency}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="mb-12 sm:mb-16 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Shield,
              title: '30-Day Money-Back',
              desc: 'Not satisfied? Get a full refund within 30 days. No questions asked.',
              color: 'emerald',
            },
            {
              icon: Clock,
              title: 'Lifetime Updates',
              desc: 'Curriculum evolves with AI. Your access includes all future updates.',
              color: 'cyan',
            },
            {
              icon: Zap,
              title: 'Start Immediately',
              desc: 'Get instant access to all modules. Begin building within minutes.',
              color: 'violet',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + idx * 0.1 }}
              className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] text-center"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4`}
              >
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color}-400`} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-white/60">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-8 sm:py-12 border-t border-white/5 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {/* Urgency reminder */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4 sm:mb-6">
            <Timer className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-amber-400">
              Only 8 spots remaining for the February cohort
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Build Without a Tech Co-Founder?
          </h2>
          <p className="text-white/60 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base px-2 sm:px-0">
            Join 500+ founders who are shipping production features faster than 10-person dev
            teams. Your AI engineering team is waiting.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-base sm:text-lg min-h-[48px]"
          >
            <span>Claim Your Spot Now</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          </Link>

          <p className="mt-4 text-xs sm:text-sm text-white/40">
            30-day money-back guarantee. No risk to try.
          </p>
        </motion.div>
      </section>
    </main>
  );
};

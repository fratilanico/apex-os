import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  DollarSign,
  BarChart3,
  Rocket,
  Shield,
  Award,
  Lightbulb,
  AlertTriangle,
  Building2,
  Landmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fundingRounds,
  capTable,
  useOfFunds,
  fundingMilestones,
  exitStrategy,
  valuationRationale
} from '@/data/fundraisingStrategy';

// Financial Projection Types
interface RevenueProjection {
  month: string;
  leads: number;
  conversion: number;
  mrr: number;
  cumulative: number;
}

interface PricingTier {
  name: string;
  monthly: number;
  lifetime: number;
  features: string[];
  target: string;
  color: string;
}

// Financial Projections (32K leads, 30% retention)
const generateProjections = (): RevenueProjection[] => {
  const projections: RevenueProjection[] = [];
  let cumulativeRevenue = 0;

  // Phase 1: Launch (Months 1-3)
  for (let i = 1; i <= 3; i++) {
    const leads = 32000;
    const conversion = i === 1 ? 0.02 : i === 2 ? 0.05 : 0.08; // 2%, 5%, 8%
    const mrr = Math.round(leads * conversion * 149); // Avg $149/month
    cumulativeRevenue += mrr * i;
    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 100),
      mrr,
      cumulative: cumulativeRevenue
    });
  }

  // Phase 2: Growth (Months 4-6)
  for (let i = 4; i <= 6; i++) {
    const conversion = 0.12 + (i - 4) * 0.02; // 12%, 14%, 16%
    const mrr = Math.round(32000 * conversion * 149);
    cumulativeRevenue += mrr;
    projections.push({
      month: `Month ${i}`,
      leads: 32000,
      conversion: Math.round(conversion * 100),
      mrr,
      cumulative: cumulativeRevenue
    });
  }

  // Phase 3: Scale (Months 7-12)
  for (let i = 7; i <= 12; i++) {
    const conversion = 0.18 + (i - 7) * 0.01; // 18% to 23%
    const mrr = Math.round(32000 * conversion * 149);
    cumulativeRevenue += mrr;
    projections.push({
      month: `Month ${i}`,
      leads: 32000,
      conversion: Math.round(conversion * 100),
      mrr,
      cumulative: cumulativeRevenue
    });
  }

  return projections;
};

// NEW PRICING STRATEGY (Improved)
const pricingTiers: PricingTier[] = [
  {
    name: 'Explorer',
    monthly: 0,
    lifetime: 0,
    features: [
      'Module 00: The Shift (FREE)',
      'Access to Vibe Community Discord',
      'Weekly newsletter with AI tips',
      'Basic tool tutorials',
      'Community support'
    ],
    target: 'Lead capture & nurturing (32K InfoAcademy students)',
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Builder',
    monthly: 49,
    lifetime: 297,
    features: [
      'Modules 00-02 (The Shift, Environment, Specifying)',
      'Access to 6 core AI tools training',
      'Self-paced learning',
      'Community forum access',
      'Monthly group Q&A',
      'Email support'
    ],
    target: 'Solo founders testing the waters',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: 'Professional',
    monthly: 149,
    lifetime: 797,
    features: [
      'ALL 6 Modules (Complete Curriculum)',
      'ALL 12 AI Tools Training',
      'Hands-on projects with real codebases',
      'Multi-agent orchestration mastery',
      'Private Discord community',
      'Weekly live Q&A sessions',
      'Certificate of completion',
      'Lifetime curriculum updates',
      'Priority email support'
    ],
    target: 'Serious founders ready to ship (CURRENT MAIN OFFER)',
    color: 'from-violet-500 to-violet-600'
  },
  {
    name: 'Accelerator',
    monthly: 299,
    lifetime: 1497,
    features: [
      'Everything in Professional',
      '2x 1-on-1 coaching calls/month',
      'Code review on your projects (4x/month)',
      'Direct Slack access to instructors',
      'Private accountability group',
      'Job board access',
      'Investor intros (graduates only)',
      'MVP review & feedback'
    ],
    target: 'Founders who need extra support & accountability',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    name: 'Agency/Team',
    monthly: 497,
    lifetime: 2497,
    features: [
      '5 team member seats included',
      'Team progress dashboard',
      'White-label curriculum option',
      'Custom onboarding for teams',
      'Monthly team strategy calls',
      'Agency toolkit & templates',
      'Reseller rights',
      'Dedicated account manager'
    ],
    target: 'Agencies & startups with teams',
    color: 'from-amber-500 to-amber-600'
  }
];

// Value Proposition Analysis
const valueProps = [
  {
    icon: Target,
    title: 'The Problem',
    description: 'Everyone wants to be a builder but doesn\'t know where to start or how to thread the needle. Expensive dev teams ($200K+/year) and CTOs are barriers to entry.',
    color: 'rose'
  },
  {
    icon: Zap,
    title: 'The Solution',
    description: 'APEX OS Academy teaches founders to orchestrate AI agents instead of writing code. Remove the need for expensive dev teams by building your own AI engineering team.',
    color: 'cyan'
  },
  {
    icon: TrendingUp,
    title: 'The Market',
    description: '32,000 InfoAcademy students ready to learn. 30% retention target. AI coding market growing 40% YoY. No-code/low-code fatigue creating demand for real technical skills.',
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Competitive Moat',
    description: 'First-mover in AI orchestration education. Proprietary curriculum based on real-world shipping experience. Gamified learning with 3D environment and terminal interface.',
    color: 'violet'
  }
];

// Go-to-Market Strategy
const gtmStrategy = [
  {
    phase: 'Phase 1: Launch (Month 1-3)',
    focus: 'Convert existing 32K InfoAcademy leads',
    tactics: [
      'Email sequence to 32K leads with free Module 00',
      'Launch webinar series: "Build Your First AI Agent"',
      'Early bird pricing ($99/month for first 100)',
      'Partner with 10 micro-influencers in founder space',
      'Product Hunt launch with exclusive lifetime deal'
    ],
    target: '1,000 paying customers (3% conversion)'
  },
  {
    phase: 'Phase 2: Growth (Month 4-6)',
    focus: 'Referral & organic growth',
    tactics: [
      'Implement referral program (1 month free per referral)',
      'Launch affiliate program (30% commission)',
      'Case study content from successful students',
      'Podcast tour (20 shows)',
      'YouTube tutorial series (2x/week)'
    ],
    target: '3,000 paying customers (9% conversion)'
  },
  {
    phase: 'Phase 3: Scale (Month 7-12)',
    focus: 'Enterprise & team expansion',
    tactics: [
      'Launch Team/Agency tier',
      'B2B outreach to accelerators & incubators',
      'Corporate training partnerships',
      'Enterprise sales team (2 reps)',
      'International expansion (EU, APAC)'
    ],
    target: '7,000+ paying customers (22% conversion)'
  }
];

const expansionPlan = [
  {
    title: 'Phase 1 — Romania Launch (Months 1–6)',
    market: '32,000 InfoAcademy leads + Romanian founder communities',
    focus: 'Establish core revenue, validate retention, and refine delivery systems.',
    milestones: [
      'Convert 3–5% of 32K leads into paid tiers',
      'Reach 1,000+ paying users with 30% retention',
      'Ship Academy v2 + live cohorts',
      'Own the local AI-builder education narrative'
    ],
    revenueTarget: '$1.5M ARR run-rate by Month 6'
  },
  {
    title: 'Phase 2 — India Expansion (Months 7–18)',
    market: 'India (1.5B population) + startup accelerators + engineering communities',
    focus: 'Scale distribution with partnerships + localized pricing.',
    milestones: [
      'India‑first cohort with localized pricing tiers',
      'Partnerships with 5–10 accelerators/incubators',
      'Campus ambassador + creator programs',
      'Regional cohort operators + support team'
    ],
    revenueTarget: '$6M+ ARR by Month 18'
  }
];

const acceleratorPlan = [
  {
    title: 'Phase 2 — APEX Accelerator (Idea → GTM in 30 Days)',
    thesis: 'We compress the founder journey using fast builder methodology + investor network.',
    pipeline: [
      'Monthly intake of 30–50 SaaS founders',
      'Rapid build sprints with APEX OS playbooks',
      'Investor demo day every 60 days',
      'Top 10–15% selected for seed readiness'
    ],
    equity: '15% equity from top candidates (leaves room for VC follow‑ons)',
    output: '10–15 seed‑ready startups/year with validated GTM and production deployments.'
  }
];

// Wireframe Sections
const wireframes = [
  {
    title: 'Explorer → Builder Conversion Flow',
    description: 'Free users get Module 00 + community. At section completion, gate next modules with upgrade CTA. Show progress locked behind paywall.',
    elements: ['Free module with clear upgrade points', 'Progress bar showing locked content', 'Social proof: "Join 500+ founders"', 'Urgency: Limited spots in live Q&A']
  },
  {
    title: 'Builder → Professional Upsell',
    description: 'Builder tier users hit wall at Module 03. Show what they\'re missing with preview of advanced orchestration content.',
    elements: ['Preview locked modules 3-5', 'ROI calculator: "Save $200K/year"', 'Success stories from Professional tier', 'Payment plan option ($149 x 6 months)']
  },
  {
    title: 'Accelerator Tier Positioning',
    description: 'Offer 1-on-1 coaching at critical moments: stuck on project, about to launch, need code review. Position as insurance policy.',
    elements: ['Contextual upsell when user stuck >30min', '"Don\'t ship broken" messaging', 'Calendly integration for booking', 'Slack connect for direct access']
  }
];

// Risk Analysis
const risks = [
  {
    risk: 'Low conversion from 32K leads',
    probability: 'Medium',
    impact: 'High',
    mitigation: 'A/B test pricing, offer payment plans, extended free trials, money-back guarantee'
  },
  {
    risk: 'AI tools become obsolete quickly',
    probability: 'High',
    impact: 'Medium',
    mitigation: 'Curriculum updates included, focus on principles not tools, community-driven tool reviews'
  },
  {
    risk: 'Competitors copy curriculum',
    probability: 'High',
    impact: 'Medium',
    mitigation: 'Continuous innovation (game environment), proprietary methodology, community network effects'
  },
  {
    risk: 'Students don\'t complete courses',
    probability: 'Medium',
    impact: 'High',
    mitigation: 'Gamification (XP, quests), accountability groups, coaching tier, completion certificates with job board access'
  }
];

export const ShowMeTheMoneyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('executive');
  const projections = generateProjections();

  const totalYear1Revenue = projections[projections.length - 1]?.cumulative ?? 0;
  const month12Mrr = projections[11]?.mrr ?? 0;

  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-7xl mx-auto pb-16 overflow-x-hidden">
      {/* Secret Header */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6"
        >
          <span className="text-sm font-bold text-emerald-400">🤫 TOP SECRET</span>
          <span className="text-white/60 text-sm">| APEX OS Business Plan 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
            SHOW ME THE MONEY
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/60 mb-8 max-w-3xl mx-auto px-2"
        >
          Comprehensive financial strategy, pricing optimization, and go-to-market plan for
          converting 32,000 InfoAcademy students into a Romania‑first launch and India‑scale expansion.
        </motion.p>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: 'Year 1 Revenue', value: `$${(totalYear1Revenue / 1000000).toFixed(1)}M`, color: 'emerald' },
            { label: 'Target Customers', value: '7,000+', color: 'cyan' },
            { label: 'Avg MRR (Mo 12)', value: `$${(month12Mrr / 1000).toFixed(0)}K`, color: 'violet' },
            { label: 'Conversion Rate', value: '22%', color: 'amber' }
          ].map((metric, idx) => (
            <div key={idx} className="p-3 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className={`text-xl sm:text-2xl font-bold text-${metric.color}-400`}>{metric.value}</div>
              <div className="text-xs text-white/50 mt-1">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="mb-12">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'executive', label: 'Executive', mobileLabel: 'Exec' },
            { id: 'pricing', label: 'Pricing', mobileLabel: 'Price' },
            { id: 'financials', label: 'Financials', mobileLabel: 'Finance' },
            { id: 'gtm', label: 'GTM', mobileLabel: 'GTM' },
            { id: 'expansion', label: 'Expansion', mobileLabel: 'Expand' },
            { id: 'accelerator', label: 'Accelerator', mobileLabel: 'Accel' },
            { id: 'fundraising', label: 'Fundraising', mobileLabel: 'Fund' },
            { id: 'wireframes', label: 'Wireframes', mobileLabel: 'Wire' },
            { id: 'risks', label: 'Risks', mobileLabel: 'Risk' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      {activeSection === 'executive' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Executive Summary</h2>
            <p className="text-white/60 px-2">The opportunity, solution, and path to $2.8M ARR</p>
          </div>

          {/* Value Proposition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {valueProps.map((prop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-all"
              >
                <div className={`inline-flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${prop.color}-500/20 border border-${prop.color}-500/30 items-center justify-center mb-4`}>
                  <prop.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${prop.color}-400`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{prop.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{prop.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Current vs Improved Pricing */}
          <div className="p-4 sm:p-6 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="inline-flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Pricing Strategy Improvement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2 text-sm sm:text-base">❌ Current Strategy</h4>
                    <ul className="text-white/60 text-xs sm:text-sm space-y-1">
                      <li>• Only 2 tiers: $200/mo or $997 lifetime</li>
                      <li>• No free tier to capture 32K leads</li>
                      <li>• No middle ground for commitment-phobes</li>
                      <li>• Missing team/agency revenue</li>
                      <li>• No upsell path beyond initial purchase</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-semibold mb-2 text-sm sm:text-base">✅ Improved Strategy</h4>
                    <ul className="text-white/60 text-xs sm:text-sm space-y-1">
                      <li>• 5-tier system from free to enterprise</li>
                      <li>• Free Module 00 captures all 32K leads</li>
                      <li>• $49 Builder tier lowers barrier to entry</li>
                      <li>• $497 Team tier unlocks B2B revenue</li>
                      <li>• Clear upgrade path: Explorer → Builder → Pro → Accelerator → Team</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Assumptions */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Key Business Assumptions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Total Addressable Market', value: '32,000 InfoAcademy students', icon: Users },
                { label: 'Target Conversion Rate', value: '22% by Month 12', icon: Target },
                { label: 'Average Revenue Per User', value: '$149/month (blended)', icon: DollarSign },
                { label: 'Retention Rate', value: '30% (as stated)', icon: Shield },
                { label: 'CAC (Customer Acquisition)', value: '$50 (organic + paid)', icon: TrendingUp },
                { label: 'LTV (Lifetime Value)', value: '$1,800 (12-month avg)', icon: Award }
              ].map((assumption, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03]">
                  <assumption.icon className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">{assumption.value}</div>
                    <div className="text-white/40 text-xs">{assumption.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* PRICING STRATEGY */}
      {activeSection === 'pricing' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pricing Strategy</h2>
            <p className="text-white/60 px-2">5-tier system designed to maximize conversion and LTV</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-all ${
                  tier.name === 'Professional' ? 'ring-2 ring-violet-500/50' : ''
                }`}
              >
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${tier.color} text-white mb-4`}>
                  {tier.name}
                </div>

                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {tier.monthly === 0 ? 'FREE' : `$${tier.monthly}`}
                    <span className="text-base sm:text-lg text-white/50">{tier.monthly > 0 ? '/mo' : ''}</span>
                  </div>
                  {tier.lifetime > 0 && (
                    <div className="text-sm text-emerald-400 mt-1">
                      or ${tier.lifetime} lifetime
                    </div>
                  )}
                </div>

                <div className="text-xs text-white/40 mb-4">{tier.target}</div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span className="break-words">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.name === 'Professional' && (
                  <div className="px-3 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-center">
                    <span className="text-violet-400 text-sm font-bold">⭐ RECOMMENDED</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pricing Psychology */}
          <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Pricing Psychology Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">🎣 The Freemium Hook</h4>
                <p className="text-white/60 text-sm">
                  Module 00 (The Shift) is free for all 32K leads. This builds trust and demonstrates value
                  before asking for payment. Conversion rate from free to paid: 15-20% expected.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">🪜 The Upgrade Ladder</h4>
                <p className="text-white/60 text-sm">
                  Builder ($49) → Professional ($149) is a 3x jump, but justified by 2x more modules and
                  community access. Payment plans ($149 x 6 months) reduce friction.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">💎 The Decoy Effect</h4>
                <p className="text-white/60 text-sm">
                  Accelerator ($299) makes Professional ($149) look like a bargain while capturing
                  high-value customers who need 1-on-1 support. Expected split: 70% Pro, 20% Accelerator.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">🏢 B2B Revenue Unlock</h4>
                <p className="text-white/60 text-sm">
                  Team tier ($497) targets agencies and startups. 5 seats = $99/seat. White-label option
                  justifies premium. Expected: 10% of revenue from teams by Month 12.
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Mix Projection */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Projected Revenue Mix (Month 12)</h3>
            <div className="space-y-4">
              {[
                { tier: 'Explorer (Free)', customers: '25,600 (80%)', revenue: '$0', percent: 0 },
                { tier: 'Builder ($49/mo)', customers: '2,240 (7%)', revenue: '$109K/mo', percent: 10 },
                { tier: 'Professional ($149/mo)', customers: '3,200 (10%)', revenue: '$477K/mo', percent: 45 },
                { tier: 'Accelerator ($299/mo)', customers: '640 (2%)', revenue: '$191K/mo', percent: 18 },
                { tier: 'Team ($497/mo)', customers: '320 (1%)', revenue: '$159K/mo', percent: 15 },
                { tier: 'Enterprise (Custom)', customers: '20 (0.06%)', revenue: '$200K/mo', percent: 12 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-32 text-sm text-white/60 shrink-0">{item.tier}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{item.customers}</span>
                      <span className="text-sm text-emerald-400">{item.revenue}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* FINANCIAL PROJECTIONS */}
      {activeSection === 'financials' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Financial Projections</h2>
            <p className="text-white/60 px-2">12-month forecast based on 32K leads and 30% retention</p>
          </div>

          {/* Revenue Chart */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Monthly Recurring Revenue (MRR)</h3>
            <div className="h-48 sm:h-64 flex items-end gap-1 sm:gap-2">
              {projections.map((p, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center min-w-0">
                  <div className="text-xs text-white/40 mb-2 hidden sm:block">${(p.mrr / 1000).toFixed(0)}K</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(p.mrr / 1100000) * 100}%` }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full bg-gradient-to-t from-cyan-500 to-violet-500 rounded-t min-h-[4px]"
                  />
                  <div className="text-xs text-white/40 mt-2">{p.month.replace('Month ', 'M')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Projections Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 sm:px-4 text-white/60 text-sm">Period</th>
                  <th className="text-right py-3 px-2 sm:px-4 text-white/60 text-sm">Leads</th>
                  <th className="text-right py-3 px-2 sm:px-4 text-white/60 text-sm">Conv.</th>
                  <th className="text-right py-3 px-2 sm:px-4 text-white/60 text-sm">MRR</th>
                  <th className="text-right py-3 px-2 sm:px-4 text-white/60 text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-2 sm:px-4 text-white font-medium text-sm">{p.month}</td>
                    <td className="py-3 px-2 sm:px-4 text-right text-white/60 text-sm">{p.leads.toLocaleString()}</td>
                    <td className="py-3 px-2 sm:px-4 text-right text-cyan-400 text-sm">{p.conversion}%</td>
                    <td className="py-3 px-2 sm:px-4 text-right text-emerald-400 text-sm">${p.mrr.toLocaleString()}</td>
                    <td className="py-3 px-2 sm:px-4 text-right text-white/60 text-sm">${p.cumulative.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="text-emerald-400 text-sm mb-1">Year 1 Revenue</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">${(totalYear1Revenue / 1000000).toFixed(2)}M</div>
              <div className="text-white/40 text-sm mt-2">Based on 32K leads, 22% conversion</div>
            </div>
            <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <div className="text-cyan-400 text-sm mb-1">Month 12 MRR</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">${(month12Mrr / 1000).toFixed(0)}K</div>
              <div className="text-white/40 text-sm mt-2">Sustainable recurring revenue</div>
            </div>
            <div className="p-4 sm:p-6 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
              <div className="text-violet-400 text-sm mb-1">Avg Customer LTV</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">$1,800</div>
              <div className="text-white/40 text-sm mt-2">12-month average retention</div>
            </div>
          </div>

          {/* Unit Economics */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Unit Economics (Month 12)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">$50</div>
                <div className="text-white/40 text-sm">Customer Acquisition Cost (CAC)</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">$1,800</div>
                <div className="text-white/40 text-sm">Lifetime Value (LTV)</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">36:1</div>
                <div className="text-white/40 text-sm">LTV:CAC Ratio</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">85%</div>
                <div className="text-white/40 text-sm">Gross Margin</div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* FUNDRAISING STRATEGY */}
      {activeSection === 'fundraising' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Fundraising & Equity Strategy</h2>
            <p className="text-white/60 px-2">$1.2M Seed Round at $6.8M pre-money valuation</p>
          </div>

          {/* Funding Rounds Overview */}
          <div className="p-4 sm:p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Funding Roadmap</h3>
            <div className="space-y-4">
              {fundingRounds.map((round, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border ${round.status === 'active' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${
                        round.status === 'completed' ? 'bg-emerald-400' :
                        round.status === 'active' ? 'bg-amber-400 animate-pulse' :
                        'bg-white/30'
                      }`} />
                      <h4 className="text-white font-bold text-sm sm:text-base">{round.stage}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs shrink-0 ${
                        round.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        round.status === 'active' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {round.status === 'completed' ? 'Completed' : round.status === 'active' ? 'Active' : 'Planned'}
                      </span>
                    </div>
                    <div className="text-emerald-400 font-bold text-sm sm:text-base">${(round.amount / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                    <div>
                      <div className="text-white/40 text-xs">Equity</div>
                      <div className="text-white text-sm">{round.equityPercent}%</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs">Pre-Money</div>
                      <div className="text-white text-sm">${(round.preMoneyValuation / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs">Post-Money</div>
                      <div className="text-white text-sm">${(round.postMoneyValuation / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-white/50">{round.timing}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cap Table Visualization */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Cap Table Evolution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(['postSeed', 'postSeriesA'] as const).map((stage) => (
                <div key={stage} className="p-4 rounded-lg bg-white/[0.03]">
                  <h4 className="text-cyan-400 font-semibold mb-3 text-sm sm:text-base">
                    {stage === 'postSeed' ? 'Post-Seed' : 'Post-Series A'}
                  </h4>
                  <div className="space-y-2">
                    {capTable[stage].filter(s => !s.name.includes('Option')).map((shareholder, sidx) => (
                      <div key={sidx} className="flex items-center justify-between text-sm">
                        <span className="text-white/70">{shareholder.name}</span>
                        <span className="text-white font-semibold">{shareholder.equityPercent}%</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10">
                      {capTable[stage].filter(s => s.name.includes('Option')).map((esop, eidx) => (
                        <div key={eidx} className="flex items-center justify-between text-sm">
                          <span className="text-white/50">{esop.name}</span>
                          <span className="text-white/70">{esop.equityPercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-lg bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/30">
                <h4 className="text-violet-400 font-semibold mb-3 text-sm sm:text-base">Founder Control</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Post-Seed</span>
                      <span className="text-emerald-400 font-bold">72.25%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72.25%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Post-Series A</span>
                      <span className="text-emerald-400 font-bold">59.26%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '59.26%' }} />
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Founders maintain majority control through Series A, ensuring strategic direction remains aligned with vision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use of Funds */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Seed Round Use of Funds ($1.2M)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {useOfFunds.seedRound.map((category, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-sm sm:text-base">{category.category}</h4>
                    <span className="text-emerald-400 font-bold text-sm sm:text-base">{category.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-2">
                    ${(category.amount / 1000).toFixed(0)}K
                  </div>
                  <p className="text-xs text-white/50 mb-3">{category.description}</p>
                  <ul className="space-y-1">
                    {category.lineItems.slice(0, 2).map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs text-white/40 flex justify-between">
                        <span>{item.item}</span>
                        <span>${(item.amount / 1000).toFixed(0)}K</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Valuation Rationale */}
          <div className="p-4 sm:p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Valuation Rationale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3 text-sm sm:text-base">Key Metrics Justifying $6.8M Pre-Money</h4>
                <div className="space-y-3">
                  {valuationRationale.currentMetrics.slice(0, 4).map((metric, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03]">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-white font-medium text-sm">{metric.metric}</div>
                        <div className="text-emerald-400 text-sm">{metric.value}</div>
                        <div className="text-white/40 text-xs">{metric.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3 text-sm sm:text-base">Comparable Valuations</h4>
                <div className="space-y-2">
                  {valuationRationale.comparables.slice(0, 4).map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                      <div className="min-w-0">
                        <div className="text-white text-sm font-medium">{comp.company}</div>
                        <div className="text-white/40 text-xs">{comp.relevance}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-emerald-400 text-sm font-bold">{comp.valuation}</div>
                        <div className="text-white/40 text-xs">{comp.multiple}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Exit Strategy */}
          <div className="p-4 sm:p-6 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Exit Strategy</h3>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-violet-400" />
                <span className="text-white font-semibold text-sm sm:text-base">Primary Path: Strategic Acquisition</span>
              </div>
              <p className="text-white/60 text-sm">Most likely exit via acquisition by EdTech giant or cloud/AI platform</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exitStrategy.scenarios.slice(0, 2).map((scenario, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/[0.03]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{scenario.type}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      scenario.probability === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                      scenario.probability === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {scenario.probability} Probability
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2">
                    ${(scenario.valuationRange.min / 1000000).toFixed(0)}M - ${(scenario.valuationRange.max / 1000000).toFixed(0)}M
                  </div>
                  <p className="text-white/50 text-xs mb-3">{scenario.rationale}</p>
                  <div className="space-y-1">
                    {scenario.potentialAcquirers.slice(0, 3).map((acquirer, aidx) => (
                      <div key={aidx} className="flex items-center justify-between text-xs">
                        <span className="text-white/70">{acquirer.name}</span>
                        <span className="text-white/40">${(acquirer.estimatedOffer / 1000000).toFixed(0)}M</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <span className="text-white font-semibold text-sm sm:text-base">IPO Timeline: 2029-2031</span>
              </div>
              <p className="text-white/60 text-sm mb-2">Target: $750M+ valuation at IPO</p>
              <div className="flex flex-wrap gap-2">
                {exitStrategy.ipoReadiness.requirements.slice(0, 4).map((req, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-white/5 text-white/50 text-xs">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Funding Milestones */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Funding Milestones & Triggers</h3>
            <div className="space-y-4">
              {fundingMilestones.slice(0, 3).map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg border border-white/10 bg-white/[0.03]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm sm:text-base">{milestone.round}</h4>
                        <p className="text-white/50 text-xs sm:text-sm">{milestone.timeline}</p>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-base sm:text-lg">
                      ${(milestone.amount / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    {milestone.milestones.slice(0, 3).map((m, midx) => (
                      <div key={midx} className="p-2 rounded bg-white/[0.05]">
                        <div className="text-white/40 text-xs">{m.metric}</div>
                        <div className="text-emerald-400 font-semibold text-sm">{m.target}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-white/50">
                    <span className="text-cyan-400">Next Round Trigger:</span> {milestone.nextRoundTrigger}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* GO-TO-MARKET */}
      {activeSection === 'gtm' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Go-to-Market Strategy</h2>
            <p className="text-white/60 px-2">3-phase launch plan to convert 32K leads into paying customers</p>
          </div>

          {/* GTM Phases */}
          <div className="space-y-6">
            {gtmStrategy.map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{phase.phase}</h3>
                    <p className="text-cyan-400 text-sm">{phase.focus}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                    <span className="text-emerald-400 text-xs sm:text-sm font-semibold">{phase.target}</span>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {phase.tactics.map((tactic, tidx) => (
                    <li key={tidx} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-cyan-400 mt-0.5 shrink-0">→</span>
                      <span className="break-words">{tactic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Channel Strategy */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Channel Distribution Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">📧 Owned (60% of leads)</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Email to 32K InfoAcademy list</li>
                  <li>• Retargeting ads (website visitors)</li>
                  <li>• In-app notifications (free users)</li>
                  <li>• SMS for high-intent leads</li>
                </ul>
              </div>
              <div>
                <h4 className="text-violet-400 font-semibold mb-2 text-sm sm:text-base">🤝 Partners (25% of leads)</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Affiliate program (30% commission)</li>
                  <li>• Influencer partnerships</li>
                  <li>• Guest podcasts & webinars</li>
                  <li>• Accelerator partnerships</li>
                </ul>
              </div>
              <div>
                <h4 className="text-emerald-400 font-semibold mb-2 text-sm sm:text-base">🌱 Organic (15% of leads)</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• YouTube tutorials (2x/week)</li>
                  <li>• Twitter/X thread content</li>
                  <li>• LinkedIn thought leadership</li>
                  <li>• Community word-of-mouth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Launch Timeline */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Launch Timeline (First 90 Days)</h3>
            <div className="space-y-4">
              {[
                { week: 'Week 1', action: 'Soft launch to 1,000 beta testers from email list', metric: 'Goal: 50 paying customers' },
                { week: 'Week 2', action: 'Product Hunt launch + Twitter announcement', metric: 'Goal: 100 new signups' },
                { week: 'Week 3', action: 'First live webinar: "Build Your First AI Agent"', metric: 'Goal: 500 attendees, 10% conversion' },
                { week: 'Week 4', action: 'Open to full 32K list with early bird pricing', metric: 'Goal: 300 total customers' },
                { week: 'Week 6', action: 'Launch affiliate program + influencer outreach', metric: 'Goal: 50 affiliates signed up' },
                { week: 'Week 8', action: 'First case study: Student success story', metric: 'Goal: Social proof content' },
                { week: 'Week 12', action: 'End early bird pricing + referral program launch', metric: 'Goal: 1,000 paying customers' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 rounded-lg bg-white/[0.03]">
                  <div className="w-16 sm:w-20 text-cyan-400 font-semibold text-sm shrink-0">{item.week}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm">{item.action}</div>
                    <div className="text-white/40 text-xs mt-1">{item.metric}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* EXPANSION PLAN */}
      {activeSection === 'expansion' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Market Expansion Plan</h2>
            <p className="text-white/60 px-2">Romania first, India scale second — structured to preserve retention.</p>
          </div>

          <div className="space-y-6">
            {expansionPlan.map((phase, idx) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                    <p className="text-cyan-400 text-sm">{phase.market}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                    {phase.revenueTarget}
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">{phase.focus}</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {phase.milestones.map((milestone, midx) => (
                    <li key={midx} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-cyan-400 mt-0.5">→</span>
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ACCELERATOR */}
      {activeSection === 'accelerator' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">APEX Accelerator</h2>
            <p className="text-white/60 px-2">Idea → GTM in 30 days, with 15% equity on top candidates.</p>
          </div>

          {acceleratorPlan.map((phase) => (
            <div key={phase.title} className="p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <Rocket className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">{phase.title}</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">{phase.thesis}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Pipeline</h4>
                  <ul className="space-y-2">
                    {phase.pipeline.map((step, idx) => (
                      <li key={idx} className="text-white/60 text-sm flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">→</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                    <div className="text-xs text-white/40 mb-2">Equity Model</div>
                    <div className="text-lg font-bold text-emerald-400">{phase.equity}</div>
                    <div className="text-white/60 text-sm mt-2">{phase.output}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.section>
      )}

      {/* WIREFRAMES */}
      {activeSection === 'wireframes' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Conversion Wireframes</h2>
            <p className="text-white/60 px-2">UX patterns designed to maximize conversion at each tier</p>
          </div>

          {/* Wireframe Cards */}
          <div className="space-y-6">
            {wireframes.map((wf, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{wf.title}</h3>
                <p className="text-white/60 text-sm mb-4">{wf.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {wf.elements.map((element, eidx) => (
                    <div key={eidx} className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03]">
                      <span className="text-cyan-400 mt-0.5 shrink-0">◆</span>
                      <span className="text-white/70 text-sm break-words">{element}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Conversion Funnel */}
          <div className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Conversion Funnel Optimization</h3>
            <div className="space-y-4">
              {[
                { stage: '32K InfoAcademy Leads', conversion: '100%', action: 'Email with free Module 00' },
                { stage: 'Explorer Tier (Free)', conversion: '80% (25.6K)', action: 'Complete Module 00' },
                { stage: 'Builder Trial', conversion: '12% (3.8K)', action: 'Pay $49 for Modules 1-2' },
                { stage: 'Professional Upgrade', conversion: '25% (960)', action: 'Pay $149 for full curriculum' },
                { stage: 'Accelerator Upsell', conversion: '15% (144)', action: 'Pay $299 for coaching' },
                { stage: 'Team Expansion', conversion: '5% (7)', action: 'Pay $497 for team seats' }
              ].map((stage, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-40 text-sm text-white/60 shrink-0">{stage.stage}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-semibold">{stage.conversion}</span>
                      <span className="text-xs text-cyan-400">{stage.action}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                        style={{ width: stage.conversion.includes('%') ? stage.conversion : '100%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* RISK ANALYSIS */}
      {activeSection === 'risks' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Risk Analysis</h2>
            <p className="text-white/60 px-2">Identified risks and mitigation strategies</p>
          </div>

          {/* Risk Matrix */}
          <div className="space-y-4">
            {risks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <h3 className="text-base sm:text-lg font-bold text-white">{risk.risk}</h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded text-xs ${
                      risk.probability === 'High' ? 'bg-red-500/20 text-red-400' :
                      risk.probability === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {risk.probability} Probability
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      risk.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                      risk.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {risk.impact} Impact
                    </span>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  <span className="text-cyan-400 font-semibold">Mitigation: </span>
                  {risk.mitigation}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Success Metrics */}
          <div className="p-4 sm:p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Success Metrics (KPIs)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { metric: 'Conversion Rate', target: '22% by Month 12', current: '2% (Month 1)', status: 'on-track' },
                { metric: 'Churn Rate', target: '< 5% monthly', current: '8% (Month 1)', status: 'needs-attention' },
                { metric: 'NPS Score', target: '> 50', current: 'Not measured', status: 'to-implement' },
                { metric: 'Course Completion', target: '> 40%', current: '25% (Month 1)', status: 'on-track' },
                { metric: 'Support Response', target: '< 4 hours', current: '6 hours', status: 'needs-attention' },
                { metric: 'MRR Growth', target: '> 15% MoM', current: '45% (Month 2)', status: 'exceeding' }
              ].map((kpi, idx) => (
                <div key={idx} className="p-3 sm:p-4 rounded-lg bg-white/[0.03]">
                  <div className="text-white font-semibold text-sm">{kpi.metric}</div>
                  <div className="text-emerald-400 text-base sm:text-lg font-bold">{kpi.target}</div>
                  <div className="text-white/40 text-xs mt-1">Current: {kpi.current}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer CTA */}
      <section className="text-center py-12 border-t border-white/10 mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Execute?</h2>
        <p className="text-white/60 mb-6 max-w-2xl mx-auto px-2 text-sm sm:text-base">
          This business plan represents a $2.8M opportunity. The infrastructure is built,
          the curriculum is ready, and 32,000 leads are waiting. Time to ship.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/academy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            <Rocket className="w-5 h-5" />
            Launch Academy
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            Print Plan
          </button>
        </div>
      </section>
    </main>
  );
};

export default ShowMeTheMoneyPage;


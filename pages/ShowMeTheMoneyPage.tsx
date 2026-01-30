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
  Clock,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    color: 'red'
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
  
  const totalYear1Revenue = projections[projections.length - 1].cumulative;
  const avgMrr = projections.reduce((acc, p) => acc + p.mrr, 0) / projections.length;
  
  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-7xl mx-auto pb-16">
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
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
            SHOW ME THE MONEY
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 mb-8 max-w-3xl mx-auto"
        >
          Comprehensive financial strategy, pricing optimization, and go-to-market plan for 
          converting 32,000 InfoAcademy students into $2.8M+ Year 1 revenue.
        </motion.p>
        
        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: 'Year 1 Revenue', value: `$${(totalYear1Revenue / 1000000).toFixed(1)}M`, color: 'emerald' },
            { label: 'Target Customers', value: '7,000+', color: 'cyan' },
            { label: 'Avg MRR (Mo 12)', value: `$${(projections[11].mrr / 1000).toFixed(0)}K`, color: 'violet' },
            { label: 'Conversion Rate', value: '22%', color: 'amber' },
          ].map((metric, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className={`text-2xl font-bold text-${metric.color}-400`}>{metric.value}</div>
              <div className="text-xs text-white/50 mt-1">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="mb-12">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'executive', label: 'Executive Summary' },
            { id: 'pricing', label: 'Pricing Strategy' },
            { id: 'financials', label: 'Financial Projections' },
            { id: 'gtm', label: 'Go-to-Market' },
            { id: 'wireframes', label: 'Wireframes' },
            { id: 'risks', label: 'Risk Analysis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
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
            <h2 className="text-3xl font-bold text-white mb-2">Executive Summary</h2>
            <p className="text-white/60">The opportunity, solution, and path to $2.8M ARR</p>
          </div>

          {/* Value Proposition Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {valueProps.map((prop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-all"
              >
                <div className={`inline-flex w-12 h-12 rounded-xl bg-${prop.color}-500/20 border border-${prop.color}-500/30 items-center justify-center mb-4`}>
                  <prop.icon className={`w-6 h-6 text-${prop.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{prop.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{prop.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Current vs Improved Pricing */}
          <div className="p-6 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
            <div className="flex items-start gap-4">
              <div className="inline-flex w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Pricing Strategy Improvement</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">❌ Current Strategy</h4>
                    <ul className="text-white/60 text-sm space-y-1">
                      <li>• Only 2 tiers: $200/mo or $997 lifetime</li>
                      <li>• No free tier to capture 32K leads</li>
                      <li>• No middle ground for commitment-phobes</li>
                      <li>• Missing team/agency revenue</li>
                      <li>• No upsell path beyond initial purchase</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-semibold mb-2">✅ Improved Strategy</h4>
                    <ul className="text-white/60 text-sm space-y-1">
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
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">Key Business Assumptions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Total Addressable Market', value: '32,000 InfoAcademy students', icon: Users },
                { label: 'Target Conversion Rate', value: '22% by Month 12', icon: Target },
                { label: 'Average Revenue Per User', value: '$149/month (blended)', icon: DollarSign },
                { label: 'Retention Rate', value: '30% (as stated)', icon: Shield },
                { label: 'CAC (Customer Acquisition)', value: '$50 (organic + paid)', icon: TrendingUp },
                { label: 'LTV (Lifetime Value)', value: '$1,800 (12-month avg)', icon: Award },
              ].map((assumption, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03]">
                  <assumption.icon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-white font-semibold text-sm">{assumption.value}</div>
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
            <h2 className="text-3xl font-bold text-white mb-2">Pricing Strategy</h2>
            <p className="text-white/60">5-tier system designed to maximize conversion and LTV</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-all ${
                  tier.name === 'Professional' ? 'ring-2 ring-violet-500/50' : ''
                }`}
              >
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${tier.color} text-white mb-4`}>
                  {tier.name}
                </div>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {tier.monthly === 0 ? 'FREE' : `$${tier.monthly}`}
                    <span className="text-lg text-white/50">{tier.monthly > 0 ? '/mo' : ''}</span>
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
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>{feature}</span>
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
          <div className="p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
            <h3 className="text-xl font-bold text-white mb-4">Pricing Psychology Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">🎣 The Freemium Hook</h4>
                <p className="text-white/60 text-sm">
                  Module 00 (The Shift) is free for all 32K leads. This builds trust and demonstrates value 
                  before asking for payment. Conversion rate from free to paid: 15-20% expected.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">🪜 The Upgrade Ladder</h4>
                <p className="text-white/60 text-sm">
                  Builder ($49) → Professional ($149) is a 3x jump, but justified by 2x more modules and 
                  community access. Payment plans ($149 x 6 months) reduce friction.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">💎 The Decoy Effect</h4>
                <p className="text-white/60 text-sm">
                  Accelerator ($299) makes Professional ($149) look like a bargain while capturing 
                  high-value customers who need 1-on-1 support. Expected split: 70% Pro, 20% Accelerator.
                </p>
              </div>
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">🏢 B2B Revenue Unlock</h4>
                <p className="text-white/60 text-sm">
                  Team tier ($497) targets agencies and startups. 5 seats = $99/seat. White-label option 
                  justifies premium. Expected: 10% of revenue from teams by Month 12.
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Mix Projection */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">Projected Revenue Mix (Month 12)</h3>
            <div className="space-y-4">
              {[
                { tier: 'Explorer (Free)', customers: '25,600 (80%)', revenue: '$0', percent: 0 },
                { tier: 'Builder ($49/mo)', customers: '2,240 (7%)', revenue: '$109K/mo', percent: 10 },
                { tier: 'Professional ($149/mo)', customers: '3,200 (10%)', revenue: '$477K/mo', percent: 45 },
                { tier: 'Accelerator ($299/mo)', customers: '640 (2%)', revenue: '$191K/mo', percent: 18 },
                { tier: 'Team ($497/mo)', customers: '320 (1%)', revenue: '$159K/mo', percent: 15 },
                { tier: 'Enterprise (Custom)', customers: '20 (0.06%)', revenue: '$200K/mo', percent: 12 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-white/60">{item.tier}</div>
                  <div className="flex-1">
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
            <h2 className="text-3xl font-bold text-white mb-2">Financial Projections</h2>
            <p className="text-white/60">12-month forecast based on 32K leads and 30% retention</p>
          </div>

          {/* Revenue Chart */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-6">Monthly Recurring Revenue (MRR)</h3>
            <div className="h-64 flex items-end gap-2">
              {projections.map((p, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-white/40 mb-2">${(p.mrr / 1000).toFixed(0)}K</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(p.mrr / 1100000) * 100}%` }}
                    transition={{ delay: idx * 0.05 }}
                    className="w-full bg-gradient-to-t from-cyan-500 to-violet-500 rounded-t"
                  />
                  <div className="text-xs text-white/40 mt-2">{p.month.replace('Month ', 'M')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Projections Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 text-sm">Period</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm">Leads</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm">Conversion</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm">MRR</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-white font-medium">{p.month}</td>
                    <td className="py-3 px-4 text-right text-white/60">{p.leads.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-cyan-400">{p.conversion}%</td>
                    <td className="py-3 px-4 text-right text-emerald-400">${p.mrr.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-white/60">${p.cumulative.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="text-emerald-400 text-sm mb-1">Year 1 Revenue</div>
              <div className="text-3xl font-bold text-white">${(totalYear1Revenue / 1000000).toFixed(2)}M</div>
              <div className="text-white/40 text-sm mt-2">Based on 32K leads, 22% conversion</div>
            </div>
            <div className="p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <div className="text-cyan-400 text-sm mb-1">Month 12 MRR</div>
              <div className="text-3xl font-bold text-white">${(projections[11].mrr / 1000).toFixed(0)}K</div>
              <div className="text-white/40 text-sm mt-2">Sustainable recurring revenue</div>
            </div>
            <div className="p-6 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
              <div className="text-violet-400 text-sm mb-1">Avg Customer LTV</div>
              <div className="text-3xl font-bold text-white">$1,800</div>
              <div className="text-white/40 text-sm mt-2">12-month average retention</div>
            </div>
          </div>

          {/* Unit Economics */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">Unit Economics (Month 12)</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-white">$50</div>
                <div className="text-white/40 text-sm">Customer Acquisition Cost (CAC)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$1,800</div>
                <div className="text-white/40 text-sm">Lifetime Value (LTV)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">36:1</div>
                <div className="text-white/40 text-sm">LTV:CAC Ratio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">85%</div>
                <div className="text-white/40 text-sm">Gross Margin</div>
              </div>
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
            <h2 className="text-3xl font-bold text-white mb-2">Go-to-Market Strategy</h2>
            <p className="text-white/60">3-phase launch plan to convert 32K leads into paying customers</p>
          </div>

          {/* GTM Phases */}
          <div className="space-y-6">
            {gtmStrategy.map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{phase.phase}</h3>
                    <p className="text-cyan-400 text-sm">{phase.focus}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <span className="text-emerald-400 text-sm font-semibold">{phase.target}</span>
                  </div>
                </div>
                <ul className="grid md:grid-cols-2 gap-2">
                  {phase.tactics.map((tactic, tidx) => (
                    <li key={tidx} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-cyan-400 mt-0.5">→</span>
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Channel Strategy */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">Channel Distribution Strategy</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">📧 Owned (60% of leads)</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Email to 32K InfoAcademy list</li>
                  <li>• Retargeting ads (website visitors)</li>
                  <li>• In-app notifications (free users)</li>
                  <li>• SMS for high-intent leads</li>
                </ul>
              </div>
              <div>
                <h4 className="text-violet-400 font-semibold mb-2">🤝 Partners (25% of leads)</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Affiliate program (30% commission)</li>
                  <li>• Influencer partnerships</li>
                  <li>• Guest podcasts & webinars</li>
                  <li>• Accelerator partnerships</li>
                </ul>
              </div>
              <div>
                <h4 className="text-emerald-400 font-semibold mb-2">🌱 Organic (15% of leads)</h4>
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
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">Launch Timeline (First 90 Days)</h3>
            <div className="space-y-4">
              {[
                { week: 'Week 1', action: 'Soft launch to 1,000 beta testers from email list', metric: 'Goal: 50 paying customers' },
                { week: 'Week 2', action: 'Product Hunt launch + Twitter announcement', metric: 'Goal: 100 new signups' },
                { week: 'Week 3', action: 'First live webinar: "Build Your First AI Agent"', metric: 'Goal: 500 attendees, 10% conversion' },
                { week: 'Week 4', action: 'Open to full 32K list with early bird pricing', metric: 'Goal: 300 total customers' },
                { week: 'Week 6', action: 'Launch affiliate program + influencer outreach', metric: 'Goal: 50 affiliates signed up' },
                { week: 'Week 8', action: 'First case study: Student success story', metric: 'Goal: Social proof content' },
                { week: 'Week 12', action: 'End early bird pricing + referral program launch', metric: 'Goal: 1,000 paying customers' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-white/[0.03]">
                  <div className="w-20 text-cyan-400 font-semibold text-sm">{item.week}</div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{item.action}</div>
                    <div className="text-white/40 text-xs mt-1">{item.metric}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            <h2 className="text-3xl font-bold text-white mb-2">Conversion Wireframes</h2>
            <p className="text-white/60">UX patterns designed to maximize conversion at each tier</p>
          </div>

          {/* Wireframe Cards */}
          <div className="space-y-6">
            {wireframes.map((wf, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <h3 className="text-xl font-bold text-white mb-2">{wf.title}</h3>
                <p className="text-white/60 text-sm mb-4">{wf.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {wf.elements.map((element, eidx) => (
                    <div key={eidx} className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03]">
                      <span className="text-cyan-400 mt-0.5">◆</span>
                      <span className="text-white/70 text-sm">{element}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Conversion Funnel */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">Conversion Funnel Optimization</h3>
            <div className="space-y-4">
              {[
                { stage: '32K InfoAcademy Leads', conversion: '100%', action: 'Email with free Module 00' },
                { stage: 'Explorer Tier (Free)', conversion: '80% (25.6K)', action: 'Complete Module 00' },
                { stage: 'Builder Trial', conversion: '12% (3.8K)', action: 'Pay $49 for Modules 1-2' },
                { stage: 'Professional Upgrade', conversion: '25% (960)', action: 'Pay $149 for full curriculum' },
                { stage: 'Accelerator Upsell', conversion: '15% (144)', action: 'Pay $299 for coaching' },
                { stage: 'Team Expansion', conversion: '5% (7)', action: 'Pay $497 for team seats' },
              ].map((stage, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-white/60">{stage.stage}</div>
                  <div className="flex-1">
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
            <h2 className="text-3xl font-bold text-white mb-2">Risk Analysis</h2>
            <p className="text-white/60">Identified risks and mitigation strategies</p>
          </div>

          {/* Risk Matrix */}
          <div className="space-y-4">
            {risks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">{risk.risk}</h3>
                  </div>
                  <div className="flex gap-2">
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
          <div className="p-6 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <h3 className="text-xl font-bold text-white mb-4">Success Metrics (KPIs)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { metric: 'Conversion Rate', target: '22% by Month 12', current: '2% (Month 1)', status: 'on-track' },
                { metric: 'Churn Rate', target: '< 5% monthly', current: '8% (Month 1)', status: 'needs-attention' },
                { metric: 'NPS Score', target: '> 50', current: 'Not measured', status: 'to-implement' },
                { metric: 'Course Completion', target: '> 40%', current: '25% (Month 1)', status: 'on-track' },
                { metric: 'Support Response', target: '< 4 hours', current: '6 hours', status: 'needs-attention' },
                { metric: 'MRR Growth', target: '> 15% MoM', current: '45% (Month 2)', status: 'exceeding' },
              ].map((kpi, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/[0.03]">
                  <div className="text-white font-semibold text-sm">{kpi.metric}</div>
                  <div className="text-emerald-400 text-lg font-bold">{kpi.target}</div>
                  <div className="text-white/40 text-xs mt-1">Current: {kpi.current}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer CTA */}
      <section className="text-center py-12 border-t border-white/10 mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Execute?</h2>
        <p className="text-white/60 mb-6 max-w-2xl mx-auto">
          This business plan represents a $2.8M opportunity. The infrastructure is built, 
          the curriculum is ready, and 32,000 leads are waiting. Time to ship.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/academy"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            <Rocket className="w-5 h-5" />
            Launch Academy
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
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
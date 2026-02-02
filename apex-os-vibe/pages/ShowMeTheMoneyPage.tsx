import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign,
  TrendingUp, 
  Users, 
  Target, 
  Shield, 
  Rocket, 
  BarChart3, 
  Zap, 
  ArrowRight,
  Award,
  AlertTriangle,
  Lightbulb,
  Building2,
  Landmark,
  Quote,
  CheckCircle2,
  ChevronRight,
  Activity,
  Monitor,
  Globe,
  Briefcase,
  Network,
  Star,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridLoader } from '@/components/artifacts/PlayerOne/components/GridLoader';
import { ExecutiveTab } from '@/components/showmethemoney/tabs/ExecutiveTab';
import { FinancialsTab } from '@/components/showmethemoney/tabs/FinancialsTab';
import { PricingTab } from '@/components/showmethemoney/tabs/PricingTab';
import { DashboardTab } from '@/components/showmethemoney/tabs/DashboardTab';
import { AnalyticsTab } from '@/components/showmethemoney/tabs/AnalyticsTab';
import { ComparablesTab } from '@/components/showmethemoney/tabs/ComparablesTab';
import { JarvisIntegration } from '@/components/jarvis/JarvisIntegration';
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
  monthly?: number;
  lifetime?: number;
  priceLabel?: string;
  billingLabel?: string;
  features: string[];
  target: string;
  color: string;
  isRecommended?: boolean;
}

const PRICING = {
  emerging: {
    entry: 89,
    mid: 149,
    pro: 249,
    accelerator: 300,
    team: 500
  },
  west: {
    entry: 299,
    mid: 499,
    pro: 749,
    accelerator: 500,
    team: 1299
  }
};

const AVERAGE_ARPU = {
  emerging: Math.round((PRICING.emerging.entry + PRICING.emerging.mid + PRICING.emerging.pro) / 3),
  west: Math.round((PRICING.west.entry + PRICING.west.mid + PRICING.west.pro) / 3)
};

const BLENDED_ARPU = Math.round((AVERAGE_ARPU.west * 0.2) + (AVERAGE_ARPU.emerging * 0.8));
const BLENDED_ACCELERATOR_FEE = Math.round((PRICING.west.accelerator * 0.2) + (PRICING.emerging.accelerator * 0.8));

// Financial Projections (Blended ARPU + West Launch Lift)
const generateProjections = (): RevenueProjection[] => {
  const projections: RevenueProjection[] = [];
  let cumulativeRevenue = 0;

  // Market Mix Assumptions
  const baseWestRatio = 0.20; // 20% US/UK/EU at launch

  // Phase 1: Launch (Months 1-3) - Validation
  for (let i = 1; i <= 3; i++) {
    const leads = 32000;
    const conversion = i === 1 ? 0.012 : i === 2 ? 0.025 : 0.04;

    const courseMRR = Math.round(leads * conversion * BLENDED_ARPU);
    const acceleratorRevenue = i >= 3 ? 6 * BLENDED_ACCELERATOR_FEE : 0;
    const totalMRR = courseMRR + acceleratorRevenue;
    cumulativeRevenue += totalMRR;

    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 100),
      mrr: totalMRR,
      cumulative: cumulativeRevenue
    });
  }

  // Phase 2: Growth (Months 4-6) - Emerging Market Scale
  for (let i = 4; i <= 6; i++) {
    const conversion = 0.06 + (i - 4) * 0.015;
    const leads = 34000 + ((i - 4) * 3500);

    const courseMRR = Math.round(leads * conversion * BLENDED_ARPU);
    const acceleratorRevenue = 12 * BLENDED_ACCELERATOR_FEE;
    const totalMRR = courseMRR + acceleratorRevenue;
    cumulativeRevenue += totalMRR;

    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 100),
      mrr: totalMRR,
      cumulative: cumulativeRevenue
    });
  }

  // Phase 3: West Launch (Months 7-12) - Premium ARPU Lift
  for (let i = 7; i <= 12; i++) {
    const conversion = 0.11 + (i - 7) * 0.012;
    const leads = 42000 + ((i - 6) * 6500);
    const westRatio = Math.min(baseWestRatio + ((i - 7) * 0.04), 0.42);
    const blendedArpuWithWest = Math.round((AVERAGE_ARPU.west * westRatio) + (AVERAGE_ARPU.emerging * (1 - westRatio)));

    const courseMRR = Math.round(leads * conversion * blendedArpuWithWest);
    const acceleratorRevenue = 24 * BLENDED_ACCELERATOR_FEE;
    const totalMRR = courseMRR + acceleratorRevenue;
    cumulativeRevenue += totalMRR;

    projections.push({
      month: `Month ${i}`,
      leads,
      conversion: Math.round(conversion * 100),
      mrr: totalMRR,
      cumulative: cumulativeRevenue
    });
  }

  return projections;
};

// SHADOW BRANDING STRATEGY (Regional Tiers)
const pricingTiersEmerging: PricingTier[] = [
  {
    name: 'CodeSprint',
    monthly: PRICING.emerging.entry,
    features: [
      'Module 00 + Core Builder Track',
      'Community Access (Regional)',
      'Tools Starter Pack'
    ],
    target: 'Emerging Markets Entry (RO/IN/LATAM)',
    color: 'from-orange-500 to-amber-500'
  },
  {
    name: 'Builder Lab',
    monthly: PRICING.emerging.mid,
    features: [
      'Full Core Curriculum',
      'Weekly Regional Live Sessions',
      'Peer Reviews + Builder Challenges'
    ],
    target: 'Momentum Tier (Community-Driven)',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    name: 'Founder Track',
    monthly: PRICING.emerging.pro,
    features: [
      'Advanced Orchestration Modules',
      'Ship-to-Launch Roadmaps',
      'Founder Network Access'
    ],
    target: 'High-Intent Builders (Shadow Brand)',
    color: 'from-emerald-500 to-cyan-500',
    isRecommended: true
  },
  {
    name: 'Accelerator (Emerging)',
    priceLabel: `$${PRICING.emerging.accelerator}`,
    billingLabel: 'one-time join',
    features: [
      '30-Day GTM Sprint',
      '2-Week Hyper Care',
      'On-Demand Support (Negotiated)'
    ],
    target: 'Top Founders (One-Time Join)',
    color: 'from-violet-500 to-purple-500'
  },
  {
    name: 'Scale (Team)',
    priceLabel: `$${PRICING.emerging.team}+`,
    billingLabel: 'team / mo',
    features: [
      'Team Seats + Progress Dashboard',
      'B2B Enablement Toolkit',
      'Dedicated Cohort Support'
    ],
    target: 'Emerging Market B2B',
    color: 'from-cyan-500 to-blue-500'
  }
];

const pricingTiersWest: PricingTier[] = [
  {
    name: 'Entry',
    monthly: PRICING.west.entry,
    features: [
      'Module 00 + Core Builder Track',
      'Global Community Access',
      'Tools Starter Pack'
    ],
    target: 'Premium Entry (US/UK/EU)',
    color: 'from-slate-500 to-slate-600'
  },
  {
    name: 'Core',
    monthly: PRICING.west.mid,
    features: [
      'Full Core Curriculum',
      'Global Live Sessions',
      'Code Reviews + Office Hours'
    ],
    target: 'Serious Builders',
    color: 'from-cyan-500 to-violet-500'
  },
  {
    name: 'Pro',
    monthly: PRICING.west.pro,
    features: [
      'Advanced Orchestration',
      'Founder Network + Certification',
      'Launch Playbooks + Reviews'
    ],
    target: 'Premium Track (High ARPU)',
    color: 'from-violet-500 to-fuchsia-500',
    isRecommended: true
  },
  {
    name: 'Accelerator (West)',
    priceLabel: `$${PRICING.west.accelerator}`,
    billingLabel: 'one-time join',
    features: [
      '30-Day GTM Sprint',
      '2-Week Hyper Care',
      'On-Demand Support (Negotiated)'
    ],
    target: 'Top Founders (One-Time Join)',
    color: 'from-emerald-500 to-cyan-500'
  },
  {
    name: 'Scale (Team)',
    priceLabel: `$${PRICING.west.team}+`,
    billingLabel: 'team / mo',
    features: [
      'Team Seats + KPI Dashboards',
      'Enterprise Enablement',
      'Dedicated B2B Partnership Support'
    ],
    target: 'B2B Scale-Up Tier',
    color: 'from-amber-500 to-orange-500'
  }
];

// Value Proposition Analysis
const valueProps = [
  {
    icon: Target,
    title: 'The Problem',
    description: 'Everyone wants to be a builder but doesn\'t know where to start. Expensive dev teams ($200K+/year) are barriers to entry.',
    color: 'rose'
  },
  {
    icon: Zap,
    title: 'The Solution',
    description: 'APEX OS Academy teaches founders to orchestrate AI agents. Remove the need for expensive dev teams.',
    color: 'cyan'
  },
  {
    icon: TrendingUp,
    title: 'The Market',
    description: '32,000 InfoAcademy students ready to learn. 30% retention target. AI coding market growing 40% YoY.',
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Moat',
    description: 'First-mover in AI orchestration. Proprietary curriculum. Gamified learning with 3D environment.',
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
      'Early bird pricing for first 100 adopters',
      'Partner with micro-influencers in founder space'
    ],
    target: '1,000 paying customers (3% conversion)'
  },
  {
    phase: 'Phase 2: Growth (Month 4-6)',
    focus: 'Referral & organic growth (Emerging Markets)',
    tactics: [
      'Implement referral program (1 month free)',
      'Launch affiliate program (30% commission)',
      'Case study content from successful students',
      'YouTube tutorial series (2x/week)'
    ],
    target: '3,000 paying customers'
  },
  {
    phase: 'Phase 3: West Launch (Month 7-12)',
    focus: 'Premium market entry (US/UK/EU) with ARPU lift',
    tactics: [
      'Premium brand positioning + new pricing page',
      'West-focused webinars with founder partners',
      'Targeted paid acquisition tests',
      'Conference and PR push (Web Summit, etc.)'
    ],
    target: '5,000 paying customers, +35% blended ARPU'
  },
  {
    phase: 'Phase 4: Scale (Month 13+)',
    focus: 'Enterprise & team expansion',
    tactics: [
      'Launch Team/Agency tier',
      'B2B outreach to accelerators & incubators',
      'Corporate training partnerships',
      'Enterprise sales team (2 reps)',
      'International expansion (Global Rollout)'
    ],
    target: '10,000+ paying customers'
  }
];

const expansionPlan = [
  {
    title: 'Phase 1 — Romania Launch (Months 1–6)',
    market: '32,000 InfoAcademy leads + Romanian founder communities',
    focus: 'Establish core revenue, validate retention.',
    milestones: [
      'Convert 3–5% of 32K leads into paid tiers',
      'Reach 1,000+ paying users with 30% retention',
      'Own the local AI-builder education narrative'
    ],
    revenueTarget: '$1.5M ARR run-rate'
  },
  {
    title: 'Phase 2 — India Expansion (Months 7–18)',
    market: 'India (1.5B population) + engineering communities',
    focus: 'Scale distribution with partnerships + localized pricing.',
    milestones: [
      'India‑first cohort with localized pricing tiers',
      'Partnerships with 5–10 accelerators/incubators',
      'Campus ambassador programs'
    ],
    revenueTarget: '$6M+ ARR by Month 18'
  },
  {
    title: 'Phase 3 — West Launch (Months 19–30)',
    market: 'US/UK/EU founders + B2B team accounts',
    focus: 'Premium brand rollout, enterprise enablement.',
    milestones: [
      'Launch premium brand site + west pricing tier',
      'Land 10–20 team accounts and 3 enterprise pilots',
      'Establish global support and sales ops'
    ],
    revenueTarget: '$12M+ ARR by Month 30'
  }
];

const acceleratorPlanExtended = [
  {
    title: 'Stage 1: Selective Intake',
    icon: Users,
    color: 'cyan',
    description: 'We filter the top 1% of performers from our global academy. Only founders who have shipped their first AI-orchestrated MVP are considered.',
    details: [
      'Performance-based whitelist',
      'Technical proficiency assessment',
      'Market opportunity review',
      'Founder commitment interview'
    ]
  },
  {
    title: 'Stage 2: 30-Day Build Sprint',
    icon: Zap,
    color: 'violet',
    description: 'A hyper-intensive execution phase where we compress months of development into 30 days using APEX OS proprietary playbooks.',
    details: [
      'Daily architectural reviews',
      'Advanced agent orchestration design',
      'Direct access to senior engineering leads',
      'Scale-ready infrastructure setup'
    ]
  },
  {
    title: 'Stage 3: GTM & Demo Day',
    icon: Rocket,
    color: 'emerald',
    description: 'We validate the product with real users and prepare the founders for their first institutional or angel investment round.',
    details: [
      'Initial 100 customer acquisition',
      'Pitch deck & financial model audit',
      'Private demo day with selected angels',
      'Direct intro to seed-stage VCs'
    ]
  },
  {
    title: 'Stage 4: Post-Launch Support',
    icon: Shield,
    color: 'amber',
    description: '2 weeks of hyper-care followed by ongoing on-demand support to ensure the startup scales without technical debt.',
    details: [
      'Performance monitoring & scaling',
      'Talent recruitment assistance',
      'Continuous architectural guidance',
      'Follow-on round support'
    ]
  }
];

const wireframes = [
  {
    title: 'Explorer → Entry Conversion Flow',
    description: 'Free users get Module 00 + community. At section completion, gate next modules with upgrade CTA.',
    elements: ['Free module with clear upgrade points', 'Progress bar showing locked content', 'Social proof: "Join 500+ founders"', 'Urgency: Limited spots']
  },
  {
    title: 'CodeSprint → Founder Track Upsell',
    description: 'Entry tier users hit wall at Module 03. Show advanced orchestration content preview.',
    elements: ['Preview locked modules 3-5', 'ROI calculator: "Save $200K/year"', 'Success stories', 'Payment plan options']
  },
  {
    title: 'Accelerator Tier Positioning',
    description: 'Offer 1-on-1 coaching at critical moments. Position as insurance policy.',
    elements: ['Contextual upsell when user stuck', '"Don\'t ship broken" messaging', 'Calendly integration', 'Slack connect']
  }
];

const risks = [
  {
    risk: 'Low conversion from 32K leads',
    probability: 'Medium',
    impact: 'High',
    mitigation: 'A/B test pricing, offer payment plans, extended free trials'
  },
  {
    risk: 'AI tools become obsolete quickly',
    probability: 'High',
    impact: 'Medium',
    mitigation: 'Curriculum updates included, focus on principles not tools'
  },
  {
    risk: 'Competitors copy curriculum',
    probability: 'High',
    impact: 'Medium',
    mitigation: 'Continuous innovation (game environment), community network effects'
  }
];

export const ShowMeTheMoneyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('executive');
  const [isLoading, setIsLoading] = useState(true);
  const projections = generateProjections();

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const totalYear1Revenue = projections[projections.length - 1]?.cumulative ?? 0;
  const month12Mrr = projections[11]?.mrr ?? 0;
  const maxMrr = Math.max(...projections.map(p => p.mrr), 1);

  return (
    <>
      <GridLoader isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
      <main className={`relative z-10 px-4 sm:px-6 max-w-7xl mx-auto pb-16 overflow-x-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Secret Header */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6"
        >
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">🤫 TOP SECRET</span>
          <span className="text-white/60 text-sm">| APEX OS Business Plan 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 uppercase">
            SHOW ME THE MONEY
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/60 mb-8 max-w-3xl mx-auto px-2"
        >
          Comprehensive financial strategy, pricing optimization, and global scale-up protocols for
          converting 32,000 InfoAcademy students into technical founders.
        </motion.p>

        {/* Key Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: 'Year 1 Revenue', value: '$501K', color: 'emerald' },
            { label: 'Target Customers', value: '590', color: 'cyan' },
            { label: 'Avg MRR (Mo 12)', value: '$88K', color: 'violet' },
            { label: 'LTV:CAC Ratio', value: '9.8:1', color: 'amber' }
          ].map((metric, idx) => (
            <div key={idx} className="p-3 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className={`text-xl sm:text-2xl font-bold text-${metric.color}-400`}>{metric.value}</div>
              <div className="text-[10px] text-white/40 mt-1 uppercase font-medium tracking-widest">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="mb-12 sticky top-4 z-50">
        <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl max-w-fit mx-auto shadow-2xl">
          {[
            { id: 'executive', label: 'Executive', mobileLabel: 'Exec' },
            { id: 'dashboard', label: 'Dashboard', mobileLabel: 'Dash' },
            { id: 'analytics', label: 'Analytics', mobileLabel: 'Analytics' },
            { id: 'comparables', label: 'Comparables', mobileLabel: 'Comp' },
            { id: 'pricing', label: 'Pricing', mobileLabel: 'Price' },
            { id: 'financials', label: 'Financials', mobileLabel: 'Finance' },
            { id: 'gtm', label: 'Go-To-Market', mobileLabel: 'GTM' },
            { id: 'expansion', label: 'Expansion', mobileLabel: 'Expand' },
            { id: 'accelerator', label: 'Accelerator', mobileLabel: 'Accel' },
            { id: 'fundraising', label: 'Fundraising', mobileLabel: 'Fund' },
            { id: 'wireframes', label: 'Wireframes', mobileLabel: 'Wire' },
            { id: 'risks', label: 'Risks', mobileLabel: 'Risk' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {/* EXECUTIVE SUMMARY */}
        {activeSection === 'executive' && (
          <motion.section
            key="executive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <ExecutiveTab projections={projections} />
          </motion.section>
        )}

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <motion.section
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <DashboardTab />
          </motion.section>
        )}

        {/* ANALYTICS */}
        {activeSection === 'analytics' && (
          <motion.section
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <AnalyticsTab />
          </motion.section>
        )}

        {/* COMPARABLES */}
        {activeSection === 'comparables' && (
          <motion.section
            key="comparables"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <ComparablesTab />
          </motion.section>
        )}

        {/* PRICING STRATEGY */}
        {activeSection === 'pricing' && (
          <motion.section
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <PricingTab />
          </motion.section>
        )}

        {/* FINANCIAL PROJECTIONS */}
        {activeSection === 'financials' && (
          <motion.section
            key="financials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <FinancialsTab />
          </motion.section>
        )}

        {/* ACCELERATOR STANDALONE - THE CENTRE PIECE */}
        {activeSection === 'accelerator' && (
          <motion.section
            key="accelerator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            <div className="text-center mb-12">
              <div className="inline-flex w-20 h-20 rounded-[2rem] bg-violet-500/20 border border-violet-500/30 items-center justify-center mb-6 shadow-2xl shadow-violet-500/20">
                <Rocket className="w-10 h-10 text-violet-400" />
              </div>
              <h2 className="text-4xl sm:text-6xl font-bold text-white mb-4 ">APEX Accelerator</h2>
              <p className="text-violet-400 font-mono text-sm uppercase tracking-[0.4em] font-bold">Neural_Venture_Protocol_v1.0</p>
            </div>

            {/* The 30-Day Sprint Visual Roadmap */}
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/0 via-violet-500/40 to-violet-500/0 hidden md:block" />
              <div className="space-y-12 relative z-10">
                {acceleratorPlanExtended.map((stage, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 sm:gap-16`}
                  >
                    <div className="flex-1 w-full">
                      <div className={`p-8 rounded-[2.5rem] border border-${stage.color}-500/20 bg-gradient-to-br from-${stage.color}-500/10 to-transparent backdrop-blur-md relative group hover:border-${stage.color}-500/40 transition-all shadow-2xl`}>
                        <div className="flex items-center gap-5 mb-6">
                          <div className={`w-14 h-14 rounded-2xl bg-${stage.color}-500/20 border border-${stage.color}-500/30 flex items-center justify-center`}>
                            <stage.icon className={`w-7 h-7 text-${stage.color}-400`} />
                          </div>
                          <h3 className="text-2xl font-bold text-white ">{stage.title}</h3>
                        </div>
                        <p className="text-white/70 text-lg mb-8 leading-relaxed  font-medium">
                          {stage.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {stage.details.map((detail, didx) => (
                            <div key={didx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                              <CheckCircle2 className={`w-4 h-4 text-${stage.color}-400 shrink-0`} />
                              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex-none hidden md:flex w-16 h-16 rounded-full bg-black border-4 border-white/10 items-center justify-center z-20 shadow-2xl">
                      <div className={`w-4 h-4 rounded-full bg-${stage.color}-500 shadow-[0_0_15px_${stage.color}]`} />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* The 15% Equity Strategic Rationale */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 sm:p-20 rounded-[3rem] border border-violet-500/30 bg-black/60 backdrop-blur-3xl relative overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.1)]"
            >
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-white mb-10  leading-none">The 15% <br/><span className="text-emerald-400">Equity Exchange</span></h3>
                  <div className="space-y-8 text-white/80 text-xl leading-relaxed  font-medium">
                    <p>
                      We transform labor into capital. By exchanging <span className="text-violet-400 font-bold">advanced orchestration expertise</span> for equity, we build a diversified portfolio of AI infrastructure.
                    </p>
                    <div className="grid grid-cols-1 gap-6 mt-10">
                      <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                          <Network className="text-cyan-400 w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Network Liquidity</h4>
                          <p className="text-xs text-white/40 leading-relaxed uppercase font-bold">Every graduate adds to the ecosystem value, creating a self-reinforcing technical moat.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center shrink-0">
                          <Briefcase className="text-violet-400 w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Portfolio Management</h4>
                          <p className="text-xs text-white/40 leading-relaxed uppercase font-bold">We maintain active board seats and technical advisory to ensure Series A readiness.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative group text-center">
                  <Quote className="w-16 h-16 text-violet-400 mx-auto mb-10 opacity-30" />
                  <p className="text-3xl font-bold text-white italic leading-tight mb-10 ">
                    "We are not just building software; we are manufacturing founders."
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-10 border-t border-white/10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-[1.4rem] bg-zinc-900 flex items-center justify-center font-bold text-white text-xl shadow-2xl">FN</div>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold text-lg uppercase tracking-widest">Fratila Nico</p>
                        <p className="text-white/30 text-[10px] uppercase font-mono tracking-[0.3em] font-bold">Chief Architect // APEX_OS</p>
                      </div>
                    </div>
                    <a 
                      href="https://calendly.com/fratilanico-vibecoderacademy" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 hover:border-violet-500/50 transition-all shadow-xl"
                    >
                      Apply for Accelerator
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* GO-TO-MARKET */}
        {activeSection === 'gtm' && (
          <motion.section
            key="gtm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Go-To-Market Strategy</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Execution Roadmap // GTM_PROTOCOL_ACTIVE</p>
            </div>

            <div className="space-y-6">
              {gtmStrategy.map((phase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white ">{phase.phase}</h3>
                      <p className="text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-widest mt-1">{phase.focus}</p>
                    </div>
                    <div className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{phase.target}</span>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.tactics.map((tactic, tidx) => (
                      <li key={tidx} className="flex items-start gap-3 text-[11px] text-white/60 font-mono uppercase font-bold tracking-tight">
                        <ChevronRight className="text-cyan-400 w-4 h-4 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* B2B SCALE-UP SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 sm:p-16 rounded-[3rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-black/40 to-transparent relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-32 h-32 text-emerald-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-5xl font-bold text-white mb-6  leading-none">B2B Scale-Up <br/><span className="text-emerald-400">& Partnerships</span></h3>
                <p className="text-white/70 text-xl mb-10 leading-relaxed  font-medium max-w-3xl">
                  Turn accelerators, agencies, and mid-market teams into repeatable revenue. Leveraging our <span className="text-emerald-400 font-bold">Sovereign B2B Database</span> to scale beyond individual builders.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-xs font-mono font-bold uppercase">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 items-center justify-center mb-4">
                      <Building2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-emerald-400 font-bold mb-2 text-sm tracking-widest">Partner Bundles</h4>
                    <p className="text-white/40 leading-relaxed tracking-wider">Custom curriculum access for accelerators and startup incubators.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-cyan-400 font-bold mb-2 text-sm tracking-widest">Team Enablement</h4>
                    <p className="text-white/40 leading-relaxed tracking-wider">Onboarding + KPI dashboards for dev leads and engineering managers.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 items-center justify-center mb-4">
                      <Landmark className="w-6 h-6 text-violet-400" />
                    </div>
                    <h4 className="text-violet-400 font-bold mb-2 text-sm tracking-widest">Enterprise Pilots</h4>
                    <p className="text-white/40 leading-relaxed tracking-wider">Direct workforce training for large-scale AI orchestration shifts.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <a
                    href="https://calendly.com/fratilanico-vibecoderacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/40 uppercase tracking-widest text-sm"
                  >
                    Book B2B Strategy Session
                    <ArrowRight className="w-6 h-6" />
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Calendly_Intake_Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* EXPANSION PLAN */}
        {activeSection === 'expansion' && (
          <motion.section
            key="expansion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 ">Market Expansion</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Romania → India → West // GLOBAL_SCALE_OPS</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {expansionPlan.map((phase, idx) => (
                <motion.div
                  key={phase.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white  group-hover:text-cyan-400 transition-colors">{phase.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        <p className="text-cyan-400 text-[10px] font-mono uppercase font-bold tracking-widest">{phase.market}</p>
                      </div>
                    </div>
                    <div className="px-6 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-lg font-bold italic tracking-tight">
                      {phase.revenueTarget}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-8 uppercase font-bold tracking-widest font-mono border-l-2 border-cyan-500/30 pl-4">{phase.focus}</p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {phase.milestones.map((milestone, midx) => (
                      <div key={midx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-all">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="text-cyan-400 w-4 h-4" />
                        </div>
                        <span className="uppercase text-[10px] font-bold tracking-wider leading-relaxed text-white/70">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* FUNDRAISING STRATEGY */}
        {activeSection === 'fundraising' && (
          <motion.section
            key="fundraising"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 ">Fundraising Strategy</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">$1.2M Seed Round // $6.8M Pre-Money Val</p>
            </div>

            {/* Rounds Waterfall */}
            <div className="space-y-6">
              {fundingRounds.map((round, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 rounded-[2rem] border ${round.status === 'active' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/[0.03]'} font-mono relative overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full shrink-0 ${
                        round.status === 'completed' ? 'bg-emerald-400' :
                        round.status === 'active' ? 'bg-amber-400 animate-pulse' :
                        'bg-white/20'
                      } shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
                      <h4 className="text-xl font-bold text-white ">{round.stage}</h4>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 italic tracking-tight">${(round.amount / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px] uppercase font-bold tracking-widest relative z-10">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-white/30 mb-1">Equity Stake</div>
                      <div className="text-white text-lg font-bold">{round.equityPercent}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-white/30 mb-1">Pre-Money</div>
                      <div className="text-white text-lg font-bold">${(round.preMoneyValuation / 1000000).toFixed(1)}M</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <div className="text-white/30 mb-1">Post-Money</div>
                      <div className="text-white text-lg font-bold">${(round.postMoneyValuation / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                  <div className="mt-6 text-[9px] text-white/40 uppercase font-bold tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Timeline: {round.timing}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cap Table Evolution */}
            <div className="p-10 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-10">
                <PieChart className="text-cyan-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-white ">Cap Table Evolution</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['postSeed', 'postSeriesA'] as const).map((stage) => (
                  <div key={stage} className="p-6 rounded-3xl bg-black/40 border border-white/5">
                    <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2">
                      {stage === 'postSeed' ? 'Post-Seed' : 'Post-Series A'}
                    </h4>
                    <div className="space-y-4">
                      {capTable[stage].map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-white/60 uppercase">{s.name}</span>
                          <span className="text-white font-bold">{s.equityPercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-transparent border border-violet-500/30">
                  <h4 className="text-violet-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-white/10 pb-2">Founder Control</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                        <span className="text-white/40">Post-Seed</span>
                        <span className="text-emerald-400 italic">72.25%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[72.25%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                        <span className="text-white/40">Post-Series A</span>
                        <span className="text-emerald-400 italic">59.26%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[59.26%]" />
                      </div>
                    </div>
                    <p className="text-[9px] text-white/30 uppercase font-bold leading-relaxed">Majority control maintained through Series A, preserving architectural vision.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Use of Funds Visualization */}
            <div className="p-10 rounded-[3rem] border border-cyan-500/20 bg-white/[0.02] backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-10 ">Use of Funds ($1.2M Seed Round)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {useOfFunds.seedRound.map((cat, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">{cat.category}</h4>
                      <span className="text-cyan-400 font-mono font-bold italic">${(cat.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.percentage}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                      />
                    </div>
                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-tight leading-relaxed">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Milestones */}
            <div className="p-10 rounded-[3rem] border border-white/10 bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white mb-10 ">Funding Milestones & Triggers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fundingMilestones.slice(0, 3).map((milestone, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col h-full group hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold italic">
                        {idx + 1}
                      </div>
                      <h4 className="text-white font-bold uppercase text-xs tracking-widest">{milestone.round}</h4>
                    </div>
                    <div className="flex-1 space-y-4">
                      {milestone.milestones.slice(0, 3).map((m, midx) => (
                        <div key={midx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-[8px] text-white/30 uppercase font-bold mb-1">{m.metric}</div>
                          <div className="text-emerald-400 font-mono font-bold text-xs">{m.target}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <p className="text-[8px] text-cyan-400 font-mono uppercase font-bold mb-1">Trigger:</p>
                      <p className="text-[9px] text-white/40 uppercase leading-relaxed font-bold">{milestone.nextRoundTrigger}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Valuation Rationale */}
            <div className="p-10 rounded-[3rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-10 ">Valuation Rationale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-cyan-400 font-bold mb-6 text-sm uppercase tracking-widest border-b border-white/5 pb-2 italic">Key Metrics Justifying $6.8M Pre-Money</h4>
                  <div className="space-y-4">
                    {valuationRationale.currentMetrics.slice(0, 4).map((metric, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 animate-pulse" />
                        <div className="min-w-0">
                          <div className="text-white font-bold text-xs  mb-1">{metric.metric}</div>
                          <div className="text-emerald-400 font-mono font-bold text-sm mb-1">{metric.value}</div>
                          <div className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{metric.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-bold mb-6 text-sm uppercase tracking-widest border-b border-white/5 pb-2 italic">Comparable Valuations</h4>
                  <div className="space-y-3">
                    {valuationRationale.comparables.slice(0, 4).map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-black/40 transition-all group">
                        <div className="min-w-0">
                          <div className="text-white font-bold text-[10px] uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{comp.company}</div>
                          <div className="text-[8px] text-white/30 uppercase font-bold mt-1 tracking-widest">{comp.relevance}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-emerald-400 font-mono font-bold text-sm italic">{comp.valuation}</div>
                          <div className="text-[8px] text-white/20 uppercase font-bold">{comp.multiple}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Exit Strategy */}
            <div className="p-10 rounded-[3rem] border border-violet-500/30 bg-black/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Landmark className="w-32 h-32 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-10 ">Exit Strategy</h3>
              <div className="mb-10 p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 shadow-2xl">
                  <Building2 className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-base mb-1">Primary Path: Strategic Acquisition</h4>
                  <p className="text-white/40 text-xs uppercase font-bold tracking-wider">Most likely exit via acquisition by EdTech giant or cloud/AI platform (Expected Year 4-6)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exitStrategy.scenarios.slice(0, 2).map((scenario, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-white font-bold  text-sm">{scenario.type}</h4>
                      <span className={`px-3 py-1 rounded-xl text-[8px] font-bold uppercase tracking-widest ${
                        scenario.probability === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                        scenario.probability === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {scenario.probability} PROB
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 tracking-tight mb-4">
                      ${(scenario.valuationRange.min / 1000000).toFixed(0)}M - ${(scenario.valuationRange.max / 1000000).toFixed(0)}M
                    </div>
                    <p className="text-[10px] text-white/40 mb-6 uppercase leading-relaxed font-bold">{scenario.rationale}</p>
                    <div className="space-y-2 pt-4 border-t border-white/5">
                      {scenario.potentialAcquirers.slice(0, 3).map((acquirer, aidx) => (
                        <div key={aidx} className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-white/60">{acquirer.name}</span>
                          <span className="text-white/20">${(acquirer.estimatedOffer / 1000000).toFixed(0)}M</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0 shadow-xl shadow-amber-500/10">
                  <Landmark className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Secondary Path: IPO Readiness (2029-2031)</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exitStrategy.ipoReadiness.requirements.slice(0, 4).map((req, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-lg bg-black/40 text-white/30 text-[8px] font-mono uppercase font-bold tracking-widest border border-white/5">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* WIREFRAMES */}
        {activeSection === 'wireframes' && (
          <motion.section
            key="wireframes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Conversion Architectures</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Psychology-Led UX // CONVERSION_PROTOCOLS</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {wireframes.map((wf, idx) => (
                <div key={idx} className="p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <h3 className="text-2xl font-bold text-white mb-4 ">{wf.title}</h3>
                  <p className="text-white/40 text-[10px] mb-8 font-mono uppercase font-bold tracking-widest border-l-2 border-violet-500/30 pl-4">{wf.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wf.elements.map((el, eidx) => (
                      <div key={eidx} className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all group">
                        <Monitor className="text-cyan-500 w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest leading-relaxed">{el}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* RISKS */}
        {activeSection === 'risks' && (
          <motion.section
            key="risks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 ">Risk Mitigation</h2>
              <p className="text-white/60 px-2 font-mono text-xs uppercase tracking-widest">Sovereign Resilience // FAILSAFE_PROTOCOLS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {risks.map((risk, idx) => (
                <div key={idx} className="p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <AlertTriangle className="w-20 h-20 text-amber-500" />
                  </div>
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0`}>
                        <AlertTriangle className={`w-6 h-6 text-amber-400`} />
                      </div>
                      <h3 className="text-xl font-bold text-white ">{risk.risk}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-white/5 text-[9px] font-bold font-mono text-white/40 uppercase tracking-widest">{risk.probability} PROB</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative z-10">
                    <p className="text-white/70 text-xs font-mono uppercase font-bold leading-relaxed">
                      <span className="text-emerald-400 font-bold mr-2 tracking-widest">MITIGATION:</span> {risk.mitigation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <section className="text-center py-20 border-t border-white/10 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6 ">Ready to Initialize Protocol?</h2>
        <p className="text-white/60 mb-10 max-w-2xl mx-auto px-4 font-mono text-xs uppercase tracking-widest leading-loose font-bold">
          This business plan represents a multi-million dollar opportunity. The infrastructure is built,
          the curriculum is validated, and 32,000 sovereign leads are awaiting handshake.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 px-4 font-bold uppercase tracking-widest text-sm">
          <Link
            to="/academy"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all active:scale-95"
          >
            <Rocket className="w-5 h-5" />
            Launch Academy
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 backdrop-blur-xl active:scale-95"
          >
            <BarChart3 className="w-5 h-5" />
            Print Strategy
          </button>
        </div>
      </section>
    </main>
    
    {/* JARVIS AI Assistant */}
    <JarvisIntegration 
      onNavigate={(section) => {
        setActiveSection(section);
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
    </>
  );
};

export default ShowMeTheMoneyPage;

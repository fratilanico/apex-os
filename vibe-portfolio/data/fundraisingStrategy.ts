/**
 * APEX OS Academy - Fundraising & Equity Strategy
 * 
 * Comprehensive fundraising strategy including:
 * - Fundraising targets and valuation
 * - Equity structure and cap table
 * - Use of funds breakdown
 * - Funding milestones
 * - Exit strategy
 */

// ============================================================================
// SECTION 1: FUNDRAISING TARGETS & VALUATION
// ============================================================================

export interface FundingRound {
  stage: string;
  amount: number; // in USD
  equityPercent: number;
  preMoneyValuation: number;
  postMoneyValuation: number;
  timing: string;
  status: 'completed' | 'active' | 'planned' | 'projected';
  leadInvestors: string[];
  targetInvestorTypes: string[];
}

export const fundingRounds: FundingRound[] = [
  {
    stage: 'Pre-Seed / Angel',
    amount: 250000,
    equityPercent: 8,
    preMoneyValuation: 2875000,
    postMoneyValuation: 3125000,
    timing: 'Month 0 (Completed)',
    status: 'completed',
    leadInvestors: ['Founder Capital', 'Friends & Family'],
    targetInvestorTypes: ['Angel Investors', 'Founder Network']
  },
  {
    stage: 'Seed Round',
    amount: 1200000,
    equityPercent: 15,
    preMoneyValuation: 6800000,
    postMoneyValuation: 8000000,
    timing: 'Month 3-6 (Active)',
    status: 'active',
    leadInvestors: ['Seeking Lead Investor'],
    targetInvestorTypes: [
      'EdTech-focused VCs',
      'AI/ML-focused Funds',
      'Operator Angels (EdTech Founders)',
      'Micro-VCs ($50-100M AUM)'
    ]
  },
  {
    stage: 'Series A',
    amount: 5000000,
    equityPercent: 18,
    preMoneyValuation: 22777778,
    postMoneyValuation: 27777778,
    timing: 'Month 18-24 (Projected)',
    status: 'projected',
    leadInvestors: ['TBD - Top-tier EdTech VC'],
    targetInvestorTypes: [
      'Tier 1 EdTech VCs (a16z, Bessemer, Owl)',
      'Growth Equity Firms',
      'Strategic Corporate Investors'
    ]
  },
  {
    stage: 'Series B',
    amount: 15000000,
    equityPercent: 15,
    preMoneyValuation: 85000000,
    postMoneyValuation: 100000000,
    timing: 'Month 36-42 (Projected)',
    status: 'projected',
    leadInvestors: ['TBD - Growth Fund'],
    targetInvestorTypes: [
      'Growth-stage VCs',
      'Private Equity (EdTech focused)',
      'Strategic Acquirers (pre-IPO)'
    ]
  }
];

// ============================================================================
// SECTION 2: EQUITY STRUCTURE & CAP TABLE
// ============================================================================

export interface Shareholder {
  name: string;
  role: string;
  shares: number;
  equityPercent: number;
  vestingSchedule: string;
  cliffMonths: number;
}

export interface CapTable {
  preSeed: Shareholder[];
  postSeed: Shareholder[];
  postSeriesA: Shareholder[];
}

export const capTable: CapTable = {
  preSeed: [
    {
      name: 'CEO / Founder',
      role: 'Chief Executive Officer',
      shares: 4500000,
      equityPercent: 45.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'CTO / Co-Founder',
      role: 'Chief Technology Officer',
      shares: 2500000,
      equityPercent: 25.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'COO / Co-Founder',
      role: 'Chief Operating Officer',
      shares: 1500000,
      equityPercent: 15.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Head of Curriculum',
      role: 'Chief Learning Officer',
      shares: 700000,
      equityPercent: 7.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Option Pool (ESOP)',
      role: 'Employee Stock Options',
      shares: 800000,
      equityPercent: 8.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    }
  ],
  postSeed: [
    {
      name: 'CEO / Founder',
      role: 'Chief Executive Officer',
      shares: 3825000,
      equityPercent: 38.25,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'CTO / Co-Founder',
      role: 'Chief Technology Officer',
      shares: 2125000,
      equityPercent: 21.25,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'COO / Co-Founder',
      role: 'Chief Operating Officer',
      shares: 1275000,
      equityPercent: 12.75,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Head of Curriculum',
      role: 'Chief Learning Officer',
      shares: 595000,
      equityPercent: 5.95,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Option Pool (ESOP)',
      role: 'Employee Stock Options',
      shares: 800000,
      equityPercent: 8.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Seed Investors',
      role: 'External Investors',
      shares: 1380000,
      equityPercent: 13.8,
      vestingSchedule: 'Immediate',
      cliffMonths: 0
    }
  ],
  postSeriesA: [
    {
      name: 'CEO / Founder',
      role: 'Chief Executive Officer',
      shares: 3136500,
      equityPercent: 31.37,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'CTO / Co-Founder',
      role: 'Chief Technology Officer',
      shares: 1742500,
      equityPercent: 17.43,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'COO / Co-Founder',
      role: 'Chief Operating Officer',
      shares: 1045500,
      equityPercent: 10.46,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Head of Curriculum',
      role: 'Chief Learning Officer',
      shares: 487900,
      equityPercent: 4.88,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Option Pool (ESOP)',
      role: 'Employee Stock Options',
      shares: 1200000,
      equityPercent: 12.0,
      vestingSchedule: '4-year vesting',
      cliffMonths: 12
    },
    {
      name: 'Seed Investors',
      role: 'Seed Round Investors',
      shares: 1131600,
      equityPercent: 11.32,
      vestingSchedule: 'Immediate',
      cliffMonths: 0
    },
    {
      name: 'Series A Investors',
      role: 'Series A Lead + Follow-on',
      shares: 2260000,
      equityPercent: 22.6,
      vestingSchedule: 'Immediate',
      cliffMonths: 0
    }
  ]
};

// ============================================================================
// SECTION 3: USE OF FUNDS BREAKDOWN
// ============================================================================

export interface UseOfFundsCategory {
  category: string;
  amount: number;
  percentage: number;
  description: string;
  lineItems: {
    item: string;
    amount: number;
    details: string;
  }[];
}

export interface UseOfFunds {
  seedRound: UseOfFundsCategory[];
  seriesA: UseOfFundsCategory[];
}

export const useOfFunds: UseOfFunds = {
  seedRound: [
    {
      category: 'Product & Engineering',
      amount: 420000,
      percentage: 35,
      description: 'Platform development, AI infrastructure, and curriculum tech',
      lineItems: [
        {
          item: 'Engineering Team (4 FTEs)',
          amount: 240000,
          details: 'Senior engineers, AI/ML specialists, platform architects'
        },
        {
          item: 'AI Infrastructure & API Costs',
          amount: 80000,
          details: 'Gemini, Perplexity, and custom model hosting costs'
        },
        {
          item: 'Platform Development',
          amount: 60000,
          details: 'Feature development, integrations, scalability improvements'
        },
        {
          item: 'DevOps & Infrastructure',
          amount: 40000,
          details: 'AWS/GCP costs, monitoring, security, compliance'
        }
      ]
    },
    {
      category: 'Growth & Marketing',
      amount: 360000,
      percentage: 30,
      description: 'Customer acquisition, brand building, and lead conversion',
      lineItems: [
        {
          item: 'Paid Acquisition (Meta, Google, LinkedIn)',
          amount: 150000,
          details: 'Target CAC $50, aiming for 3,000 new customers'
        },
        {
          item: 'Content Production',
          amount: 60000,
          details: 'Video production, blog content, social media assets'
        },
        {
          item: 'Influencer & Affiliate Program',
          amount: 50000,
          details: 'Partner commissions, influencer partnerships, referral rewards'
        },
        {
          item: 'Events & Webinars',
          amount: 40000,
          details: 'Virtual and in-person events, demo days, community meetups'
        },
        {
          item: 'Brand & Creative',
          amount: 60000,
          details: 'Design, copywriting, PR, brand partnerships'
        }
      ]
    },
    {
      category: 'Team & Operations',
      amount: 240000,
      percentage: 20,
      description: 'Core team expansion and operational infrastructure',
      lineItems: [
        {
          item: 'Leadership & Management',
          amount: 100000,
          details: 'Head of Growth, Head of Customer Success salaries'
        },
        {
          item: 'Customer Success Team',
          amount: 60000,
          details: 'Support agents, community managers, onboarding specialists'
        },
        {
          item: 'Curriculum & Instruction',
          amount: 50000,
          details: 'Course creators, instructors, content reviewers'
        },
        {
          item: 'Operations & Admin',
          amount: 30000,
          details: 'Legal, accounting, HR, office space, tools'
        }
      ]
    },
    {
      category: 'Working Capital & Reserve',
      amount: 180000,
      percentage: 15,
      description: 'Emergency fund, opportunity fund, and operational buffer',
      lineItems: [
        {
          item: 'Emergency Reserve',
          amount: 80000,
          details: '6-month runway buffer for unexpected challenges'
        },
        {
          item: 'Opportunity Fund',
          amount: 60000,
          details: 'Strategic partnerships, M&A opportunities, new market entry'
        },
        {
          item: 'Legal & Compliance',
          amount: 40000,
          details: 'GDPR compliance, terms of service, IP protection'
        }
      ]
    }
  ],
  seriesA: [
    {
      category: 'Scale & Expansion',
      amount: 1750000,
      percentage: 35,
      description: 'International expansion and market penetration',
      lineItems: [
        {
          item: 'India Market Launch',
          amount: 600000,
          details: 'Localized platform, partnerships, local team hiring'
        },
        {
          item: 'EU Expansion',
          amount: 400000,
          details: 'GDPR compliance, EU data centers, localized marketing'
        },
        {
          item: 'Enterprise Sales Team',
          amount: 500000,
          details: 'B2B sales reps, SDRs, account executives'
        },
        {
          item: 'Partnership Development',
          amount: 250000,
          details: 'Accelerator partnerships, university deals, corporate training'
        }
      ]
    },
    {
      category: 'Product Innovation',
      amount: 1500000,
      percentage: 30,
      description: 'Next-generation features and AI capabilities',
      lineItems: [
        {
          item: 'AI/ML Research & Development',
          amount: 600000,
          details: 'Proprietary models, personalization engine, adaptive learning'
        },
        {
          item: 'Platform Scale',
          amount: 400000,
          details: 'Microservices architecture, global CDN, real-time features'
        },
        {
          item: 'Mobile App Development',
          amount: 300000,
          details: 'iOS and Android native apps for learning on-the-go'
        },
        {
          item: 'Enterprise Features',
          amount: 200000,
          details: 'SSO, admin dashboards, analytics, custom integrations'
        }
      ]
    },
    {
      category: 'Growth Acceleration',
      amount: 1250000,
      percentage: 25,
      description: 'Aggressive customer acquisition and brand building',
      lineItems: [
        {
          item: 'Performance Marketing',
          amount: 600000,
          details: 'Scaled paid acquisition across all channels'
        },
        {
          item: 'Brand Marketing',
          amount: 300000,
          details: 'TV, podcast sponsorships, outdoor advertising'
        },
        {
          item: 'Community & Events',
          amount: 200000,
          details: 'Global conferences, hackathons, demo days'
        },
        {
          item: 'PR & Communications',
          amount: 150000,
          details: 'Media relations, thought leadership, awards'
        }
      ]
    },
    {
      category: 'Team Scale',
      amount: 500000,
      percentage: 10,
      description: 'Key hires and team expansion',
      lineItems: [
        {
          item: 'Executive Hires',
          amount: 200000,
          details: 'VP Engineering, VP Marketing, VP Sales'
        },
        {
          item: 'Team Expansion',
          amount: 200000,
          details: 'Engineering, design, customer success, sales teams'
        },
        {
          item: 'Advisors & Consultants',
          amount: 100000,
          details: 'Strategic advisors, industry experts, board members'
        }
      ]
    }
  ]
};

// ============================================================================
// SECTION 4: FUNDING MILESTONES
// ============================================================================

export interface FundingMilestone {
  round: string;
  amount: number;
  timeline: string;
  milestones: {
    metric: string;
    target: string;
    description: string;
  }[];
  keyAchievements: string[];
  nextRoundTrigger: string;
}

export const fundingMilestones: FundingMilestone[] = [
  {
    round: 'Pre-Seed / Angel',
    amount: 250000,
    timeline: 'Month 0-3',
    milestones: [
      {
        metric: 'MVP Launch',
        target: 'Complete',
        description: 'Functional platform with core curriculum and AI terminal'
      },
      {
        metric: 'Beta Users',
        target: '500+',
        description: 'Active beta testers providing feedback'
      },
      {
        metric: 'Paying Customers',
        target: '50+',
        description: 'First revenue from early adopters'
      },
      {
        metric: 'Curriculum Completion',
        target: '3 Modules',
        description: 'Core curriculum modules 00-02 fully developed'
      }
    ],
    keyAchievements: [
      'Platform MVP shipped and stable',
      'Initial curriculum validated with beta users',
      'First $10K MRR achieved',
      'Core team of 4 hired and onboarded',
      '32K InfoAcademy lead list secured'
    ],
    nextRoundTrigger: 'Product-market fit signals: 20%+ conversion from free to paid, <5% monthly churn, positive NPS'
  },
  {
    round: 'Seed Round',
    amount: 1200000,
    timeline: 'Month 3-18',
    milestones: [
      {
        metric: 'Monthly Recurring Revenue',
        target: '$150K MRR',
        description: 'Sustainable recurring revenue from 1,000+ paying customers'
      },
      {
        metric: 'Customer Count',
        target: '3,000+',
        description: 'Total paying customers across all tiers'
      },
      {
        metric: 'Conversion Rate',
        target: '15%+',
        description: 'Free to paid conversion from Module 00'
      },
      {
        metric: 'Retention Rate',
        target: '30%+',
        description: 'Monthly retention rate (inverse of churn)'
      },
      {
        metric: 'Net Promoter Score',
        target: '50+',
        description: 'Customer satisfaction and referral likelihood'
      },
      {
        metric: 'Team Size',
        target: '15 FTEs',
        description: 'Full-time employees across all functions'
      }
    ],
    keyAchievements: [
      'Complete curriculum (all 6 modules) shipped',
      'Gamified learning environment fully operational',
      'AI multi-agent system production-ready',
      'Accelerator program launched with first cohort',
      'Romania market dominance established',
      'Unit economics positive (LTV/CAC > 3:1)'
    ],
    nextRoundTrigger: 'Growth acceleration: $150K+ MRR, 15%+ MoM growth, proven playbook for international expansion'
  },
  {
    round: 'Series A',
    amount: 5000000,
    timeline: 'Month 18-36',
    milestones: [
      {
        metric: 'Annual Recurring Revenue',
        target: '$6M ARR',
        description: 'Annualized recurring revenue run-rate'
      },
      {
        metric: 'Customer Count',
        target: '15,000+',
        description: 'Total paying customers globally'
      },
      {
        metric: 'International Revenue',
        target: '30%+',
        description: 'Revenue from outside Romania (India, EU)'
      },
      {
        metric: 'Enterprise Customers',
        target: '50+',
        description: 'Team/Enterprise tier customers'
      },
      {
        metric: 'Accelerator Portfolio',
        target: '30+ Startups',
        description: 'Startups graduated from APEX Accelerator'
      },
      {
        metric: 'Team Size',
        target: '50 FTEs',
        description: 'Full-time employees across 3 regions'
      }
    ],
    keyAchievements: [
      'India market fully operational with local team',
      'EU expansion completed with GDPR compliance',
      'Enterprise sales motion proven and scalable',
      'Accelerator portfolio generating follow-on investment interest',
      'Proprietary AI learning models deployed',
      'Mobile apps launched and adopted'
    ],
    nextRoundTrigger: 'Market leadership: $6M+ ARR, international presence, enterprise traction, clear path to $50M ARR'
  },
  {
    round: 'Series B',
    amount: 15000000,
    timeline: 'Month 36-48',
    milestones: [
      {
        metric: 'Annual Recurring Revenue',
        target: '$25M ARR',
        description: 'Annualized recurring revenue run-rate'
      },
      {
        metric: 'Customer Count',
        target: '50,000+',
        description: 'Total paying customers globally'
      },
      {
        metric: 'Enterprise Revenue',
        target: '40%+',
        description: 'Revenue from Team and Enterprise tiers'
      },
      {
        metric: 'Geographic Presence',
        target: '10+ Countries',
        description: 'Active operations in multiple regions'
      },
      {
        metric: 'Accelerator Success Rate',
        target: '70%+',
        description: 'Accelerator graduates raising follow-on funding'
      },
      {
        metric: 'Team Size',
        target: '150 FTEs',
        description: 'Full-time employees across global offices'
      }
    ],
    keyAchievements: [
      'Global market leader in AI-builder education',
      'Enterprise business driving majority of revenue',
      'Accelerator portfolio valued at $100M+',
      'Proprietary technology moat established',
      'Multiple revenue streams (SaaS + Accelerator + Enterprise)',
      'Path to profitability demonstrated'
    ],
    nextRoundTrigger: 'IPO readiness or strategic acquisition: $25M+ ARR, 40%+ growth, clear profitability timeline'
  }
];

// ============================================================================
// SECTION 5: EXIT STRATEGY
// ============================================================================

export interface ExitScenario {
  type: string;
  probability: 'High' | 'Medium' | 'Low';
  timeline: string;
  valuationRange: {
    min: number;
    max: number;
  };
  rationale: string;
  potentialAcquirers: {
    name: string;
    rationale: string;
    estimatedOffer: number;
  }[];
}

export interface ExitStrategy {
  primaryPath: string;
  secondaryPath: string;
  scenarios: ExitScenario[];
  ipoReadiness: {
    timeline: string;
    requirements: string[];
    targetValuation: number;
  };
}

export const exitStrategy: ExitStrategy = {
  primaryPath: 'Strategic Acquisition',
  secondaryPath: 'IPO (Long-term)',
  scenarios: [
    {
      type: 'Strategic Acquisition by EdTech Giant',
      probability: 'High',
      timeline: 'Year 4-6',
      valuationRange: { min: 100000000, max: 250000000 },
      rationale: 'Established EdTech companies seeking AI capabilities and founder community',
      potentialAcquirers: [
        {
          name: 'Coursera',
          rationale: 'Expanding into AI/ML skills, needs practical builder community',
          estimatedOffer: 150000000
        },
        {
          name: 'Udemy',
          rationale: 'Struggling with engagement, APEX gamification solves this',
          estimatedOffer: 120000000
        },
        {
          name: 'LinkedIn Learning (Microsoft)',
          rationale: 'Integration with LinkedIn network, AI skill verification',
          estimatedOffer: 200000000
        },
        {
          name: 'Pluralsight',
          rationale: 'Technical skills focus aligns perfectly, enterprise synergy',
          estimatedOffer: 180000000
        }
      ]
    },
    {
      type: 'Acquisition by Cloud/AI Platform',
      probability: 'Medium',
      timeline: 'Year 3-5',
      valuationRange: { min: 150000000, max: 400000000 },
      rationale: 'Cloud providers and AI platforms seeking distribution and training capabilities',
      potentialAcquirers: [
        {
          name: 'Google Cloud',
          rationale: 'Gemini ecosystem expansion, developer education',
          estimatedOffer: 250000000
        },
        {
          name: 'AWS (Amazon)',
          rationale: 'Bedrock AI training, AWS certification integration',
          estimatedOffer: 300000000
        },
        {
          name: 'Microsoft',
          rationale: 'GitHub Copilot education, Azure AI skills',
          estimatedOffer: 350000000
        },
        {
          name: 'OpenAI',
          rationale: 'ChatGPT ecosystem, practical application training',
          estimatedOffer: 400000000
        }
      ]
    },
    {
      type: 'Acquisition by PE / Growth Equity',
      probability: 'Medium',
      timeline: 'Year 5-7',
      valuationRange: { min: 200000000, max: 500000000 },
      rationale: 'Financial buyers seeking profitable EdTech with strong unit economics',
      potentialAcquirers: [
        {
          name: 'Vista Equity Partners',
          rationale: 'EdTech focus, operational improvement playbook',
          estimatedOffer: 300000000
        },
        {
          name: 'KKR',
          rationale: 'Technology education thesis, global expansion capital',
          estimatedOffer: 350000000
        },
        {
          name: 'Silver Lake',
          rationale: 'Growth technology investments, platform strategy',
          estimatedOffer: 400000000
        }
      ]
    },
    {
      type: 'IPO (Initial Public Offering)',
      probability: 'Low',
      timeline: 'Year 6-8',
      valuationRange: { min: 500000000, max: 1000000000 },
      rationale: 'Independent public company if market conditions favorable and growth sustained',
      potentialAcquirers: []
    }
  ],
  ipoReadiness: {
    timeline: 'Year 6-8 (2029-2031)',
    requirements: [
      '$100M+ ARR with 30%+ growth rate',
      'Positive EBITDA margins (15%+)',
      'Diversified revenue streams (SaaS + Enterprise + Accelerator)',
      'Global presence in 10+ countries',
      'Proven management team with public company experience',
      'Clean financials audited by Big 4 firm',
      'Strong corporate governance and board',
      'Market leadership position in AI-builder education'
    ],
    targetValuation: 750000000
  }
};

// ============================================================================
// SECTION 6: VALUATION RATIONALE
// ============================================================================

export interface ValuationRationale {
  currentMetrics: {
    metric: string;
    value: string;
    impact: string;
  }[];
  comparables: {
    company: string;
    valuation: string;
    multiple: string;
    relevance: string;
  }[];
  valuationMethodology: {
    method: string;
    calculation: string;
    result: string;
  }[];
  riskFactors: {
    factor: string;
    impact: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }[];
}

export const valuationRationale: ValuationRationale = {
  currentMetrics: [
    {
      metric: 'Total Addressable Market',
      value: '$50B+ (Global EdTech)',
      impact: 'Large market supports premium valuations'
    },
    {
      metric: 'Serviceable Addressable Market',
      value: '32,000 InfoAcademy leads',
      impact: 'Immediate high-intent customer base'
    },
    {
      metric: 'Product-Market Fit Signals',
      value: 'Early traction, positive feedback',
      impact: 'Reduces execution risk for investors'
    },
    {
      metric: 'Competitive Moat',
      value: 'First-mover in AI orchestration education',
      impact: 'Sustainable competitive advantage'
    },
    {
      metric: 'Unit Economics',
      value: 'LTV/CAC 36:1, 85% gross margin',
      impact: 'Capital efficient growth potential'
    },
    {
      metric: 'Team Quality',
      value: 'Experienced founders + domain experts',
      impact: 'Execution capability de-risks investment'
    }
  ],
  comparables: [
    {
      company: 'Codecademy (acquired 2021)',
      valuation: '$525M',
      multiple: '8x ARR',
      relevance: 'Similar coding education model, lower AI focus'
    },
    {
      company: 'DataCamp',
      valuation: '$400M (Series B)',
      multiple: '10x ARR',
      relevance: 'Technical skills platform, subscription model'
    },
    {
      company: 'Pluralsight (IPO 2018)',
      valuation: '$2B+',
      multiple: '12x ARR',
      relevance: 'Enterprise technical training, similar TAM'
    },
    {
      company: 'Lambda School',
      valuation: '$150M (Series B)',
      multiple: 'N/A (ISA model)',
      relevance: 'Alternative education, founder-focused'
    },
    {
      company: 'Maven',
      valuation: '$25M (Seed)',
      multiple: 'Pre-revenue premium',
      relevance: 'Cohort-based learning, community focus'
    }
  ],
  valuationMethodology: [
    {
      method: 'Berkus Method (Pre-Seed)',
      calculation: 'Sound Idea ($500K) + Prototype ($500K) + Quality Management ($500K) + Strategic Relationships ($500K) + Product Rollout ($500K)',
      result: '$2.5M pre-money valuation'
    },
    {
      method: 'Venture Capital Method (Seed)',
      calculation: 'Projected Year 5 exit: $150M @ 20% IRR, 15% dilution, $6M ARR @ 8x multiple',
      result: '$6.8M pre-money valuation'
    },
    {
      method: 'Comparable Company Analysis',
      calculation: 'EdTech average 8-12x ARR, APEX at 6.8x projected Year 1 ARR',
      result: '$6-8M valuation range'
    },
    {
      method: 'Scorecard Method',
      calculation: 'Team (125%) + Size (100%) + Product (150%) + Competition (100%) + Marketing (125%) + Need (150%)',
      result: '$6.5M average pre-money'
    }
  ],
  riskFactors: [
    {
      factor: 'Market Timing',
      impact: 'Medium',
      mitigation: 'AI adoption accelerating, first-mover advantage'
    },
    {
      factor: 'Competition',
      impact: 'Medium',
      mitigation: 'Proprietary curriculum, community network effects'
    },
    {
      factor: 'Execution Risk',
      impact: 'Medium',
      mitigation: 'Experienced team, proven methodology'
    },
    {
      factor: 'Technology Obsolescence',
      impact: 'High',
      mitigation: 'Focus on principles over tools, continuous updates'
    },
    {
      factor: 'Customer Concentration',
      impact: 'Low',
      mitigation: 'Diversified customer base, multiple tiers'
    }
  ]
};

// ============================================================================
// SECTION 7: INVESTOR TARGETS
// ============================================================================

export interface InvestorTarget {
  tier: string;
  focus: string;
  firms: {
    name: string;
    location: string;
    stage: string;
    checkSize: string;
    thesis: string;
    relevance: string;
    warmIntro: string;
  }[];
}

export const investorTargets: InvestorTarget[] = [
  {
    tier: 'Tier 1: Dream Investors',
    focus: 'Top-tier EdTech and AI-focused funds',
    firms: [
      {
        name: 'a16z (Andreessen Horowitz)',
        location: 'Menlo Park, CA',
        stage: 'Seed - Series A',
        checkSize: '$1-5M',
        thesis: 'AI, education, future of work',
        relevance: 'Leading AI investor, EdTech portfolio',
        warmIntro: 'Through portfolio company founder'
      },
      {
        name: 'Bessemer Venture Partners',
        location: 'San Francisco, CA',
        stage: 'Seed - Series B',
        checkSize: '$1-10M',
        thesis: 'Cloud, education, marketplace',
        relevance: 'Strong EdTech track record (Udemy, Piazza)',
        warmIntro: 'LinkedIn warm intro to partner'
      },
      {
        name: 'Owl Ventures',
        location: 'San Francisco, CA',
        stage: 'Seed - Series C',
        checkSize: '$2-15M',
        thesis: 'EdTech-only fund, global focus',
        relevance: 'Largest EdTech VC, perfect fit',
        warmIntro: 'Direct outreach + demo day'
      },
      {
        name: 'Reach Capital',
        location: 'San Francisco, CA',
        stage: 'Seed - Series A',
        checkSize: '$1-5M',
        thesis: 'Education technology, workforce development',
        relevance: 'Workforce development focus aligns',
        warmIntro: 'Through education network'
      }
    ]
  },
  {
    tier: 'Tier 2: Strong Strategic Fit',
    focus: 'Sector specialists and regional leaders',
    firms: [
      {
        name: 'EduCapital',
        location: 'Paris, France',
        stage: 'Seed - Series A',
        checkSize: '$500K-3M',
        thesis: 'European EdTech, workforce development',
        relevance: 'EU expansion support, local knowledge',
        warmIntro: 'European founder network'
      },
      {
        name: 'Brighteye Ventures',
        location: 'Paris, France',
        stage: 'Pre-Seed - Series A',
        checkSize: '$300K-2M',
        thesis: 'European EdTech, AI-enabled learning',
        relevance: 'AI focus, European market expertise',
        warmIntro: 'Demo day application'
      },
      {
        name: 'Learn Capital',
        location: 'Palo Alto, CA',
        stage: 'Seed - Series B',
        checkSize: '$1-5M',
        thesis: 'Education innovation, global impact',
        relevance: 'Deep EdTech expertise, portfolio synergies',
        warmIntro: 'Portfolio founder introduction'
      },
      {
        name: 'GSV Ventures',
        location: 'Chicago, IL',
        stage: 'Seed - Series B',
        checkSize: '$1-10M',
        thesis: 'Skills-based learning, workforce',
        relevance: 'Workforce development focus',
        warmIntro: 'GSV Summit networking'
      }
    ]
  },
  {
    tier: 'Tier 3: Emerging & Regional',
    focus: 'Emerging managers and regional funds',
    firms: [
      {
        name: 'Hoxton Ventures',
        location: 'London, UK',
        stage: 'Seed',
        checkSize: '$500K-2M',
        thesis: 'European tech, AI/ML applications',
        relevance: 'EU market entry support',
        warmIntro: 'London startup ecosystem'
      },
      {
        name: 'Speedinvest',
        location: 'Vienna, Austria',
        stage: 'Pre-Seed - Series A',
        checkSize: '$300K-3M',
        thesis: 'Deep tech, AI, European expansion',
        relevance: 'Central/Eastern Europe focus',
        warmIntro: 'Regional startup events'
      },
      {
        name: 'Earlybird Venture Capital',
        location: 'Berlin, Germany',
        stage: 'Seed - Series A',
        checkSize: '$1-5M',
        thesis: 'European tech, digital education',
        relevance: 'German market, EdTech interest',
        warmIntro: 'Berlin startup community'
      },
      {
        name: 'Launchub Ventures',
        location: 'Sofia, Bulgaria',
        stage: 'Seed',
        checkSize: '$200K-1M',
        thesis: 'Southeast Europe, tech startups',
        relevance: 'Regional expertise, Romania connections',
        warmIntro: 'Local founder network'
      }
    ]
  }
];

// ============================================================================
// SECTION 8: FUNDRAISING TIMELINE
// ============================================================================

export interface FundraisingTimeline {
  phase: string;
  duration: string;
  activities: string[];
  deliverables: string[];
  milestones: string[];
}

export const fundraisingTimeline: FundraisingTimeline[] = [
  {
    phase: 'Phase 1: Preparation (Months -2 to 0)',
    duration: '8 weeks',
    activities: [
      'Finalize financial model and projections',
      'Prepare investor deck (15-20 slides)',
      'Create data room with key metrics',
      'Develop investor target list (50+ firms)',
      'Prepare one-pager and executive summary',
      'Record product demo video',
      'Gather customer testimonials and case studies'
    ],
    deliverables: [
      'Pitch deck (PDF and Keynote)',
      'Financial model (Excel)',
      'Data room (Notion/DocSend)',
      'One-pager (PDF)',
      'Demo video (3-5 minutes)',
      'Target investor spreadsheet'
    ],
    milestones: [
      'Materials ready for first investor meeting',
      'Advisory board secured (2-3 members)',
      'Warm intro network mapped'
    ]
  },
  {
    phase: 'Phase 2: Outreach (Months 0 to 2)',
    duration: '8 weeks',
    activities: [
      'Send warm intros to Tier 1 investors',
      'Attend 2-3 startup events/demo days',
      'Conduct 20-30 first meetings',
      'Follow up with interested parties',
      'Gather feedback and iterate pitch',
      'Host office hours with potential leads'
    ],
    deliverables: [
      '50+ investor conversations logged',
      '5-10 second meetings scheduled',
      '2-3 term sheets received',
      'Updated deck based on feedback'
    ],
    milestones: [
      'First term sheet received',
      'Lead investor identified',
      'Due diligence initiated'
    ]
  },
  {
    phase: 'Phase 3: Due Diligence (Months 2 to 3)',
    duration: '4-6 weeks',
    activities: [
      'Provide financial records and projections',
      'Share customer data and metrics',
      'Legal review of cap table and contracts',
      'Technical due diligence (code review)',
      'Reference checks with customers and partners',
      'Negotiate term sheet details'
    ],
    deliverables: [
      'Audited financial statements',
      'Customer metrics dashboard',
      'Legal documentation package',
      'Technical architecture review',
      'Reference call summaries'
    ],
    milestones: [
      'Due diligence completed',
      'Final term sheet signed',
      'Legal docs in review'
    ]
  },
  {
    phase: 'Phase 4: Closing (Months 3 to 4)',
    duration: '2-4 weeks',
    activities: [
      'Finalize legal documentation',
      'Coordinate wire transfers',
      'Update cap table and shareholder agreements',
      'Announce funding publicly',
      'Onboard new board members',
      'Plan first board meeting'
    ],
    deliverables: [
      'Signed investment agreements',
      'Funds received in company account',
      'Updated cap table',
      'Press release and PR campaign',
      'Board meeting scheduled'
    ],
    milestones: [
      'Round officially closed',
      'Funds in bank',
      'Public announcement made'
    ]
  }
];

// ============================================================================
// SECTION 9: KEY METRICS FOR INVESTORS
// ============================================================================

export interface InvestorMetrics {
  category: string;
  metrics: {
    name: string;
    current: string;
    target: string;
    benchmark: string;
    importance: 'Critical' | 'Important' | 'Nice-to-have';
  }[];
}

export const investorMetrics: InvestorMetrics[] = [
  {
    category: 'Growth Metrics',
    metrics: [
      {
        name: 'Monthly Recurring Revenue (MRR)',
        current: '$10K',
        target: '$150K (Month 18)',
        benchmark: '15-20% MoM growth',
        importance: 'Critical'
      },
      {
        name: 'Annual Recurring Revenue (ARR)',
        current: '$120K',
        target: '$1.8M (Month 18)',
        benchmark: 'EdTech avg: $1-3M at Series A',
        importance: 'Critical'
      },
      {
        name: 'Revenue Growth Rate',
        current: '45% MoM',
        target: '20%+ MoM sustained',
        benchmark: 'Top quartile: 15-25% MoM',
        importance: 'Critical'
      },
      {
        name: 'Customer Count',
        current: '100',
        target: '3,000+ (Month 18)',
        benchmark: '1,000+ for Series A',
        importance: 'Important'
      }
    ]
  },
  {
    category: 'Unit Economics',
    metrics: [
      {
        name: 'Customer Acquisition Cost (CAC)',
        current: '$50',
        target: '<$75',
        benchmark: 'LTV/CAC > 3:1',
        importance: 'Critical'
      },
      {
        name: 'Lifetime Value (LTV)',
        current: '$1,800',
        target: '$2,500+',
        benchmark: '12-18 month retention',
        importance: 'Critical'
      },
      {
        name: 'LTV/CAC Ratio',
        current: '36:1',
        target: '>5:1',
        benchmark: 'Healthy: 3:1+, Great: 5:1+',
        importance: 'Critical'
      },
      {
        name: 'Payback Period',
        current: '1 month',
        target: '<6 months',
        benchmark: 'SaaS avg: 12-18 months',
        importance: 'Important'
      }
    ]
  },
  {
    category: 'Retention & Engagement',
    metrics: [
      {
        name: 'Monthly Churn Rate',
        current: '8%',
        target: '<5%',
        benchmark: 'SaaS avg: 5-7%',
        importance: 'Critical'
      },
      {
        name: 'Net Revenue Retention',
        current: '95%',
        target: '>110%',
        benchmark: 'Best-in-class: 120%+',
        importance: 'Important'
      },
      {
        name: 'Course Completion Rate',
        current: '25%',
        target: '>40%',
        benchmark: 'Online avg: 15-20%',
        importance: 'Important'
      },
      {
        name: 'Net Promoter Score (NPS)',
        current: 'N/A',
        target: '>50',
        benchmark: 'SaaS avg: 30-40',
        importance: 'Nice-to-have'
      }
    ]
  },
  {
    category: 'Product & Operations',
    metrics: [
      {
        name: 'Gross Margin',
        current: '85%',
        target: '>80%',
        benchmark: 'SaaS avg: 70-85%',
        importance: 'Critical'
      },
      {
        name: 'Free-to-Paid Conversion',
        current: '5%',
        target: '15%+',
        benchmark: 'Freemium avg: 2-5%',
        importance: 'Important'
      },
      {
        name: 'Average Revenue Per User (ARPU)',
        current: '$100',
        target: '$150+',
        benchmark: 'EdTech avg: $50-200',
        importance: 'Important'
      },
      {
        name: 'Team Size',
        current: '4',
        target: '15 (Month 18)',
        benchmark: 'Capital efficient growth',
        importance: 'Nice-to-have'
      }
    ]
  }
];

// ============================================================================
// SECTION 10: TERM SHEET EXPECTATIONS
// ============================================================================

export interface TermSheetExpectations {
  section: string;
  typicalTerms: string;
  ourExpectations: string;
  negotiationStrategy: string;
}

export const termSheetExpectations: TermSheetExpectations[] = [
  {
    section: 'Valuation',
    typicalTerms: '$5-10M pre-money for Seed stage',
    ourExpectations: '$6.8M pre-money based on traction and market',
    negotiationStrategy: 'Lead with comparables, emphasize unit economics and growth rate'
  },
  {
    section: 'Investment Amount',
    typicalTerms: '$1-2M for Seed',
    ourExpectations: '$1.2M to reach Series A milestones',
    negotiationStrategy: 'Show detailed use of funds, 18-month runway requirement'
  },
  {
    section: 'Equity Stake',
    typicalTerms: '15-25% for Seed investors',
    ourExpectations: '15% maximum to preserve founder control',
    negotiationStrategy: 'Accept 15% for right investor, push back on >20%'
  },
  {
    section: 'Liquidation Preference',
    typicalTerms: '1x non-participating preferred',
    ourExpectations: '1x non-participating preferred (standard)',
    negotiationStrategy: 'Accept standard terms, reject participating preferred'
  },
  {
    section: 'Board Composition',
    typicalTerms: '2 founders + 1 investor + 1 independent',
    ourExpectations: '2 founders + 1 investor (Seed stage)',
    negotiationStrategy: 'Keep board small, add independent at Series A'
  },
  {
    section: 'Anti-Dilution Protection',
    typicalTerms: 'Broad-based weighted average',
    ourExpectations: 'Broad-based weighted average (standard)',
    negotiationStrategy: 'Accept standard, reject full ratchet'
  },
  {
    section: 'Pro-Rata Rights',
    typicalTerms: 'Major investors get pro-rata in future rounds',
    ourExpectations: 'All Seed investors get pro-rata',
    negotiationStrategy: 'Offer pro-rata to all Seed investors to build loyalty'
  },
  {
    section: 'Information Rights',
    typicalTerms: 'Monthly financials, quarterly board meetings',
    ourExpectations: 'Monthly updates, quarterly board meetings',
    negotiationStrategy: 'Standard reporting, efficient processes'
  },
  {
    section: 'Vesting',
    typicalTerms: '4-year vesting with 1-year cliff for founders',
    ourExpectations: '4-year vesting with 1-year cliff (already in place)',
    negotiationStrategy: 'No negotiation needed, already standard'
  },
  {
    section: 'Option Pool',
    typicalTerms: '10-15% post-money ESOP',
    ourExpectations: '12% post-money ESOP (already have 8%)',
    negotiationStrategy: 'Refresh pool to 12% pre-Series A hiring'
  }
];

// ============================================================================
// EXPORT ALL DATA
// ============================================================================

export const fundraisingData = {
  fundingRounds,
  capTable,
  useOfFunds,
  fundingMilestones,
  exitStrategy,
  valuationRationale,
  investorTargets,
  fundraisingTimeline,
  investorMetrics,
  termSheetExpectations
};

export default fundraisingData;

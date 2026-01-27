export interface DeploymentExample {
  idea: string;
  features: string[];
  time: number;
  cost: number;
}

export const DEMO_EXAMPLES: DeploymentExample[] = [
  {
    idea: 'marketplace for vintage sneakers',
    features: ['database_schema', 'api_endpoints', 'react_frontend', 'payment_integration', 'tests'],
    time: 93,
    cost: 2.40
  },
  {
    idea: 'SaaS dashboard for real estate agents',
    features: ['auth_system', 'analytics_dashboard', 'crm_integration', 'email_automation', 'tests'],
    time: 87,
    cost: 2.15
  },
  {
    idea: 'mobile app for restaurant reservations',
    features: ['react_native_app', 'booking_system', 'push_notifications', 'payment_processing', 'tests'],
    time: 102,
    cost: 3.10
  },
  {
    idea: 'crypto wallet with instant swaps',
    features: ['wallet_infrastructure', 'blockchain_integration', 'swap_engine', 'security_audit', 'tests'],
    time: 118,
    cost: 4.20
  },
  {
    idea: 'productivity tool for remote teams',
    features: ['real_time_collaboration', 'video_conferencing', 'task_management', 'integrations', 'tests'],
    time: 95,
    cost: 2.80
  }
];

export const PRICING_ROTATIONS = [
  {
    before: '$200,000',
    after: '$200/month',
    subtitle: 'Skip the technical co-founder. Build with AI agents instead.'
  },
  {
    before: '10-person team',
    after: '12 AI agents',
    subtitle: 'No equity given. No salary negotiation. No turnover risk.'
  },
  {
    before: '6 months',
    after: '6 weeks',
    subtitle: 'Ship your MVP before competitors finish their pitch deck.'
  }
];

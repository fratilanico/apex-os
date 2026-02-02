import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { FinancialTrajectoryChart } from '../charts/FinancialTrajectoryChart';
import { UnitEconomicsChart } from '../charts/UnitEconomicsChart';
import { monthlyProjections, keyMilestones } from '../../../data/financialModel';

// Format helpers
const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

// Premium Metric Card Component
interface PremiumMetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose';
  delay?: number;
}

const PremiumMetricCard: React.FC<PremiumMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color,
  delay = 0,
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-5 
                 hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer
                 group relative overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      bg-gradient-to-br from-${color}-500/5 to-transparent`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} 
                          flex items-center justify-center border`}>
            <Icon className="w-5 h-5" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
              ${trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
                trend === 'down' ? 'bg-rose-500/20 text-rose-400' : 
                'bg-white/10 text-white/60'}`}
            >
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
               trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
              {trendValue}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
          <div className="text-white/60 text-sm">{title}</div>
          <div className={`text-xs ${colorClasses[color].split(' ')[1]}`}>{subtitle}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Milestone Timeline Component
const MilestoneTimeline: React.FC = () => {
  const milestones = [
    { month: 6, label: 'Early Traction', status: 'completed', color: 'violet' },
    { month: 12, label: 'Product-Market Fit', status: 'completed', color: 'cyan' },
    { month: 16, label: 'Cash Flow Positive', status: 'in_progress', color: 'emerald' },
    { month: 18, label: 'Series A Ready', status: 'upcoming', color: 'amber' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
          <Calendar className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Key Milestones</h3>
          <p className="text-xs text-white/40">Journey to profitability</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-white/10" />

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Dot */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                ${milestone.status === 'completed' 
                  ? `bg-${milestone.color}-500 border-2 border-${milestone.color}-400` 
                  : milestone.status === 'in_progress'
                  ? `bg-${milestone.color}-500/30 border-2 border-${milestone.color}-400 animate-pulse`
                  : 'bg-white/10 border-2 border-white/20'}`}
              >
                <span className={`text-xs font-bold 
                  ${milestone.status === 'completed' ? 'text-white' : 
                    milestone.status === 'in_progress' ? `text-${milestone.color}-400` : 'text-white/40'}`}
                >
                  M{milestone.month}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold 
                    ${milestone.status === 'upcoming' ? 'text-white/40' : 'text-white'}`}
                  >
                    {milestone.label}
                  </span>                  
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      milestone.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-white/10 text-white/40'}`}
                  >
                    {milestone.status === 'completed' ? '✓ Completed' :
                     milestone.status === 'in_progress' ? '● In Progress' :
                     '○ Upcoming'}
                  </span>
                </div>
                
                {milestone.status === 'completed' && milestone.month === 6 && (
                  <div className="text-xs text-white/40 mt-1">
                    {keyMilestones.month6.customers} customers • {formatCurrency(keyMilestones.month6.mrr)} MRR
                  </div>
                )}
                {milestone.status === 'completed' && milestone.month === 12 && (
                  <div className="text-xs text-white/40 mt-1">
                    {keyMilestones.month12.customers} customers • {formatCurrency(keyMilestones.month12.mrr)} MRR
                  </div>
                )}
                {milestone.status === 'in_progress' && (
                  <div className="text-xs text-amber-400 mt-1">
                    🎉 Cash flow positive! {formatCurrency(keyMilestones.month16.mrr)} MRR
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main Dashboard Tab
export const DashboardTab: React.FC = () => {
  // Get latest data
  const latestData = monthlyProjections[monthlyProjections.length - 1];
  const month12Data = monthlyProjections.find(m => m.month === 12);
  const month6Data = monthlyProjections.find(m => m.month === 6);

  // Calculate runway
  const runwayMonths = Math.floor(latestData.cumulativeCash / Math.abs(latestData.netCashFlow));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Executive Dashboard</h2>
        <p className="text-white/60 font-mono text-xs uppercase tracking-widest">Real-time Financial Overview</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PremiumMetricCard
          title="Total Revenue"
          value={formatCurrency(latestData.cumulativeRevenue)}
          subtitle="18-month cumulative"
          icon={DollarSign}
          trend="up"
          trendValue="+156%"
          color="emerald"
          delay={0.1}
        />

        <PremiumMetricCard
          title="Current MRR"
          value={formatCurrency(latestData.mrr)}
          subtitle="Month 18 run rate"
          icon={TrendingUp}
          trend="up"
          trendValue="+383%"
          color="cyan"
          delay={0.2}
        />

        <PremiumMetricCard
          title="Total Customers"
          value={latestData.totalCustomers.toString()}
          subtitle="Active subscribers"
          icon={Users}
          trend="up"
          trendValue="+383%"
          color="violet"
          delay={0.3}
        />

        <PremiumMetricCard
          title="Cash Runway"
          value={`${runwayMonths} months`}
          subtitle="At current burn rate"
          icon={Clock}
          trend={latestData.netCashFlow > 0 ? 'up' : 'neutral'}
          trendValue={latestData.netCashFlow > 0 ? 'Profitable' : 'Stable'}
          color={latestData.netCashFlow > 0 ? 'emerald' : 'amber'}
          delay={0.4}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Trajectory - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <FinancialTrajectoryChart height={450} />
        </motion.div>

        {/* Milestones - Takes 1 column */}
        <div className="lg:col-span-1">
          <MilestoneTimeline />
        </div>
      </div>

      {/* Unit Economics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <UnitEconomicsChart height={400} />
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { 
            label: 'LTV:CAC Ratio', 
            value: '9.8:1', 
            icon: Target,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
          },
          { 
            label: 'Gross Margin', 
            value: '82%', 
            icon: PieChart,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
          },
          { 
            label: 'Monthly Churn', 
            value: '5%', 
            icon: Activity,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
          },
          { 
            label: 'ARPU', 
            value: '$149', 
            icon: BarChart3,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10'
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4
                       hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Last Updated */}
      <div className="text-center text-xs text-white/30 pt-4">
        Dashboard updated: {new Date().toLocaleString()} • Data source: financialModel.ts
      </div>
    </div>
  );
};

export default DashboardTab;

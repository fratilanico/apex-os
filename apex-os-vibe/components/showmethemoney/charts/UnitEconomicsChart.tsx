import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, Clock, Users, Target, Calculator } from 'lucide-react';

interface UnitEconomicsChartProps {
  height?: number;
}

// Unit Economics Data
const unitEconomicsData = {
  cac: 150, // Customer Acquisition Cost
  ltv: 1466, // Lifetime Value
  ltvCacRatio: 9.8,
  paybackPeriod: 1.2, // months
  grossMargin: 0.82, // 82%
  monthlyChurn: 0.05, // 5%
  arpu: 149, // Average Revenue Per User
};

// CAC Breakdown
const cacBreakdown = [
  { name: 'Paid Ads', value: 45, color: '#22d3ee' },
  { name: 'Content', value: 35, color: '#a78bfa' },
  { name: 'Referrals', value: 25, color: '#10b981' },
  { name: 'Partnerships', value: 20, color: '#f59e0b' },
  { name: 'Organic', value: 25, color: '#f43f5e' },
];

// LTV Components
const ltvComponents = [
  { name: 'Base Revenue', value: 1200, color: '#10b981' },
  { name: 'Upsells', value: 200, color: '#22d3ee' },
  { name: 'Referrals', value: 66, color: '#a78bfa' },
];

const formatCurrency = (value: number) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
};

export const UnitEconomicsChart: React.FC<UnitEconomicsChartProps> = ({
  height = 350,
}) => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cac' | 'ltv'>('cac');

  const data = viewMode === 'cac' ? cacBreakdown : ltvComponents;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#0a0a0f]/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-white font-bold text-sm">{item.name}</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(item.value)}</div>
          <div className="text-xs text-white/40">
            {((item.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}% of total
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Unit Economics</h3>
            <p className="text-xs text-white/40">CAC • LTV • Payback Period</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setViewMode('cac')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cac'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'text-white/40 hover:text-white'
            }`}
          >
            CAC
          </button>
          <button
            onClick={() => setViewMode('ltv')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'ltv'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                : 'text-white/40 hover:text-white'
            }`}
          >
            LTV
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-rose-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">CAC</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(unitEconomicsData.cac)}</div>
          <div className="text-xs text-rose-400 mt-1">Blended 18-month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">LTV</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(unitEconomicsData.ltv)}</div>
          <div className="text-xs text-emerald-400 mt-1">12-month value</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">LTV:CAC</span>
          </div>
          <div className="text-2xl font-bold text-white">{unitEconomicsData.ltvCacRatio}:1</div>
          <div className="text-xs text-cyan-400 mt-1">Excellent ratio</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">Payback</span>
          </div>
          <div className="text-2xl font-bold text-white">{unitEconomicsData.paybackPeriod} mo</div>
          <div className="text-xs text-amber-400 mt-1">Fast recovery</div>
        </motion.div>
      </div>

      {/* Chart and Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
        >
          <h4 className="text-sm font-bold text-white mb-4">
            {viewMode === 'cac' ? 'CAC Breakdown' : 'LTV Components'}
          </h4>

          <div style={{ width: '100%', height: height - 100 }} className="touch-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={(_, index) => setActiveSegment(data[index].name)}
                  onMouseLeave={() => setActiveSegment(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                      opacity={activeSegment === null || activeSegment === entry.name ? 1 : 0.3}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {viewMode === 'cac' ? formatCurrency(unitEconomicsData.cac) : formatCurrency(unitEconomicsData.ltv)}
              </div>
              <div className="text-xs text-white/40">{viewMode === 'cac' ? 'Total CAC' : 'Total LTV'}</div>
            </div>
          </div>
        </motion.div>

        {/* Legend and Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
        >
          <h4 className="text-sm font-bold text-white mb-4">Breakdown</h4>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {data.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    activeSegment === item.name
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                  onMouseEnter={() => setActiveSegment(item.name)}
                  onMouseLeave={() => setActiveSegment(null)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-white text-sm">{item.name}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-mono font-bold">{formatCurrency(item.value)}</div>
                    <div className="text-xs text-white/40">
                      {((item.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{(unitEconomicsData.grossMargin * 100).toFixed(0)}%</div>
                <div className="text-xs text-white/40">Gross Margin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{(unitEconomicsData.monthlyChurn * 100).toFixed(0)}%</div>
                <div className="text-xs text-white/40">Monthly Churn</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">Strong Unit Economics</h4>
            <p className="text-white/60 text-sm">
              With an LTV:CAC ratio of {unitEconomicsData.ltvCacRatio}:1 and a payback period of only{' '}
              {unitEconomicsData.paybackPeriod} months, APEX OS demonstrates exceptional unit economics. 
              The 82% gross margin provides a healthy buffer for growth investments.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UnitEconomicsChart;

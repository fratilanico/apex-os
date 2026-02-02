import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Calculator,
  Download,
  Target,
  Activity,
} from 'lucide-react';
import { monthlyProjections } from '../../../data/financialModel';

// Format helpers
const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

// Sensitivity Analysis Component
const SensitivityAnalysis: React.FC = () => {
  const [conversionRate, setConversionRate] = useState(3.5);
  const [churnRate, setChurnRate] = useState(5);
  const [arpu, setArpu] = useState(149);

  // Calculate impact
  const baseRevenue = monthlyProjections[17].monthlyRevenue;
  const adjustedRevenue = baseRevenue * (conversionRate / 3.5) * (1 + (5 - churnRate) / 100) * (arpu / 149);
  const impact = ((adjustedRevenue - baseRevenue) / baseRevenue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Calculator className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Sensitivity Analysis</h3>
            <p className="text-xs text-white/40">Impact of variable changes on M18 revenue</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Conversion Rate Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Conversion Rate</span>
            <span className="text-cyan-400 font-mono">{conversionRate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={conversionRate}
            onChange={(e) => setConversionRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-white/30">
            <span>1%</span>
            <span>Base: 3.5%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Churn Rate Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Monthly Churn</span>
            <span className="text-rose-400 font-mono">{churnRate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={churnRate}
            onChange={(e) => setChurnRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-xs text-white/30">
            <span>1%</span>
            <span>Base: 5%</span>
            <span>15%</span>
          </div>
        </div>

        {/* ARPU Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">ARPU</span>
            <span className="text-emerald-400 font-mono">${arpu}</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="5"
            value={arpu}
            onChange={(e) => setArpu(parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-white/30">
            <span>$50</span>
            <span>Base: $149</span>
            <span>$300</span>
          </div>
        </div>
      </div>

      {/* Impact Display */}
      <div className={`p-4 rounded-xl border ${
        impact >= 0 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-rose-500/10 border-rose-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60 mb-1">Projected M18 Revenue Impact</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(adjustedRevenue)}</div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${impact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {impact >= 0 ? '+' : ''}{impact.toFixed(1)}%
            </div>
            <div className="text-xs text-white/40">vs base scenario</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// CAC by Channel Chart
const CACChannelChart: React.FC = () => {
  const data = [
    { name: 'Email', cac: 20, customers: 150, color: '#22d3ee' },
    { name: 'Content', cac: 180, customers: 50, color: '#a78bfa' },
    { name: 'Paid Ads', cac: 450, customers: 200, color: '#f59e0b' },
    { name: 'Referrals', cac: 50, customers: 100, color: '#10b981' },
    { name: 'Partners', cac: 100, customers: 80, color: '#f43f5e' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
            <Target className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">CAC by Channel</h3>
            <p className="text-xs text-white/40">Customer acquisition cost breakdown</p>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis 
              type="number" 
              tickFormatter={(v) => `$${v}`}
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              width={80}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#0a0a0f]/95 border border-white/10 rounded-xl p-3 shadow-2xl">
                      <div className="font-bold text-white mb-1">{item.name}</div>
                      <div className="text-sm text-white/60">CAC: <span className="text-white font-mono">${item.cac}</span></div>
                      <div className="text-sm text-white/60">Customers: <span className="text-white font-mono">{item.customers}</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Bar dataKey="cac" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-lg font-bold text-white">$150</div>
          <div className="text-xs text-white/40">Blended CAC</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-lg font-bold text-white">580</div>
          <div className="text-xs text-white/40">Total Customers</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-lg font-bold text-emerald-400">9.8:1</div>
          <div className="text-xs text-white/40">LTV:CAC</div>
        </div>
      </div>
    </motion.div>
  );
};

// Cash Flow Waterfall
const CashFlowWaterfall: React.FC = () => {
  const data = monthlyProjections.slice(0, 12).map(m => ({
    month: m.monthLabel,
    revenue: m.monthlyRevenue,
    expenses: -m.totalExpenses,
    net: m.netCashFlow,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cash Flow Waterfall</h3>
            <p className="text-xs text-white/40">Monthly revenue vs expenses (First 12 months)</p>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(v) => formatCurrency(v)}
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickLine={false}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#0a0a0f]/95 border border-white/10 rounded-xl p-3 shadow-2xl">
                      <div className="font-bold text-white mb-2">{item.month}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-emerald-400">Revenue:</span>
                          <span className="text-white font-mono">{formatCurrency(item.revenue)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-rose-400">Expenses:</span>
                          <span className="text-white font-mono">{formatCurrency(Math.abs(item.expenses))}</span>
                        </div>
                        <div className="border-t border-white/10 pt-1 mt-1">
                          <div className="flex justify-between gap-4 font-bold">
                            <span className={item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}>Net:</span>
                            <span className="text-white font-mono">{formatCurrency(item.net)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.8} />
            
            <Line 
              type="monotone" 
              dataKey="net" 
              stroke="#22d3ee" 
              strokeWidth={2}
              dot={{ fill: '#22d3ee', strokeWidth: 0, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Main Analytics Tab
export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Financial Analytics</h2>
        <p className="text-white/60 font-mono text-xs uppercase tracking-widest">Deep-dive Analysis & Scenarios</p>
      </motion.div>

      {/* Sensitivity Analysis */}
      <SensitivityAnalysis />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CACChannelChart />
        <CashFlowWaterfall />
      </div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Download className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Export Financial Data</h3>
              <p className="text-xs text-white/40">Download complete financial model</p>
            </div>
          </div>

          <button className="px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 
                           hover:bg-cyan-500/30 transition-all font-bold text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

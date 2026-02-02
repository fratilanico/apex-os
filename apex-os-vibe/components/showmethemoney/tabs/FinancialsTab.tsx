import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Area, Bar, Line, PieChart, Pie, Cell,
} from 'recharts';
import { SectionHeader } from '../shared/SectionHeader';
import { GlassCard } from '../shared/GlassCard';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

type Scenario = 'base' | 'monster' | 'bear';

export const FinancialsTab: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('base');

  const scenarioConfig = {
    base: { label: 'Base Case', color: '#22d3ee', revenue: '$501K', customers: 590, mrr: '$88K' },
    monster: { label: 'Monster', color: '#10b981', revenue: '$1.2M', customers: 1200, mrr: '$165K' },
    bear: { label: 'Bear', color: '#f43f5e', revenue: '$280K', customers: 320, mrr: '$45K' },
  };

  const unitEconomics = [
    { name: 'LTV', value: 1466, color: '#10b981' },
    { name: 'CAC', value: 150, color: '#f43f5e' },
    { name: 'COGS', value: 200, color: '#f59e0b' },
    { name: 'Margin', value: 1116, color: '#22d3ee' },
  ];

  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const multipliers = { base: 1, monster: 1.8, bear: 0.6 };
    const m = multipliers[scenario];
    
    return months.map((month, idx) => {
      const baseMRR = Math.round(8000 * m * Math.pow(1.12, idx));
      return {
        month,
        mrr: baseMRR,
        newRevenue: Math.round(baseMRR * 0.25),
        cumulative: months.slice(0, idx + 1).reduce((sum, _, i) => sum + Math.round(8000 * m * Math.pow(1.12, i)), 0),
      };
    });
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-12">
      <SectionHeader
        title="Financial Projections"
        subtitle="Three scenarios: Conservative growth, accelerated viral growth, and downside protection"
        align="center"
      />

      <div className="flex flex-wrap justify-center gap-4">
        {(Object.keys(scenarioConfig) as Scenario[]).map((s) => (
          <motion.button
            key={s}
            onClick={() => setScenario(s)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            style={{
              background: scenario === s ? `linear-gradient(135deg, ${scenarioConfig[s].color}30, ${scenarioConfig[s].color}10)` : 'rgba(255, 255, 255, 0.03)',
              border: `2px solid ${scenario === s ? scenarioConfig[s].color : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: scenario === s ? `0 0 30px ${scenarioConfig[s].color}40` : 'none',
              color: scenario === s ? '#fff' : 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <div className="text-center">
              <div className="text-sm uppercase tracking-wider mb-1">{scenarioConfig[s].label}</div>
              <div className="text-2xl font-bold" style={{ color: scenarioConfig[s].color }}>{scenarioConfig[s].revenue}</div>
              <div className="text-xs text-white/40 mt-1">Year 1 Revenue</div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard level={2} className="text-center">
          <div className="text-4xl font-bold text-cyan-400 mb-2">{scenarioConfig[scenario].customers}</div>
          <div className="text-white/60">Target Customers</div>
          <div className="text-sm text-white/40 mt-1">Year 1</div>
        </GlassCard>

        <GlassCard level={2} className="text-center">
          <div className="text-4xl font-bold text-violet-400 mb-2">{scenarioConfig[scenario].mrr}</div>
          <div className="text-white/60">MRR Month 12</div>
          <div className="text-sm text-white/40 mt-1">Monthly Recurring</div>
        </GlassCard>

        <GlassCard level={2} className="text-center">
          <div className="text-4xl font-bold text-emerald-400 mb-2">9.8:1</div>
          <div className="text-white/60">LTV:CAC Ratio</div>
          <div className="text-sm text-white/40 mt-1">Best-in-class</div>
        </GlassCard>
      </div>

      <section>
        <SectionHeader title="Revenue Trajectory" subtitle="Monthly recurring revenue and cumulative growth" align="center" />
        <GlassCard level={2} className="mt-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.2)" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="rgba(255, 255, 255, 0.2)" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }} />
                <Area yAxisId="left" type="monotone" dataKey="mrr" name="MRR" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#mrrGradient)" />
                <Bar yAxisId="left" dataKey="newRevenue" name="New Revenue" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="left" type="monotone" dataKey="cumulative" name="Cumulative" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      <section>
        <SectionHeader title="Unit Economics" subtitle="Lifetime Value breakdown per customer" align="center" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {unitEconomics.map((item, idx) => (
            <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <GlassCard level={2} className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>${item.value.toLocaleString()}</div>
                <div className="text-white/60 text-sm">{item.name}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FinancialsTab;

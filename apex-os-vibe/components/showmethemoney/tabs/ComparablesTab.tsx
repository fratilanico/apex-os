import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Globe,
  Zap,
  Layers,
} from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface Competitor {
  name: string;
  valuation: number;
  revenue: number;
  growth: number;
  users: string;
  focus: string;
  color: string;
}

const competitors: Competitor[] = [
  { name: 'Codecademy', valuation: 525, revenue: 50, growth: 30, users: '50M', focus: 'B2C / Interactive', color: '#22d3ee' },
  { name: 'Pluralsight', valuation: 3500, revenue: 400, growth: 20, users: '1M', focus: 'B2B / Enterprise', color: '#a78bfa' },
  { name: 'Udemy', valuation: 3300, revenue: 600, growth: 25, users: '62M', focus: 'Marketplace', color: '#10b981' },
  { name: 'Coursera', valuation: 2500, revenue: 500, growth: 35, users: '120M', focus: 'Academic / Degrees', color: '#f59e0b' },
  { name: 'Lambda School', valuation: 150, revenue: 20, growth: 15, users: '10K', focus: 'ISA / Bootcamps', color: '#f43f5e' },
  { name: 'APEX OS', valuation: 12, revenue: 0.5, growth: 300, users: '590', focus: 'AI Orchestration', color: '#ffffff' },
];

const marketData = competitors.map(c => ({
  name: c.name,
  x: c.revenue,
  y: c.growth,
  z: c.valuation,
  color: c.color
}));

export const ComparablesTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Market Comparables</h2>
        <p className="text-white/60 font-mono text-xs uppercase tracking-widest">Market Landscape & Positioning</p>
      </motion.div>

      {/* Market Landscape Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Market Landscape</h3>
            <p className="text-xs text-white/40">Revenue vs Growth vs Valuation (Bubble size)</p>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Revenue" 
                unit="M" 
                stroke="rgba(255,255,255,0.3)"
                label={{ value: 'Annual Revenue ($M)', position: 'bottom', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Growth" 
                unit="%" 
                stroke="rgba(255,255,255,0.3)"
                label={{ value: 'YoY Growth (%)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <ZAxis type="number" dataKey="z" range={[100, 2000]} name="Valuation" unit="M" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0a0a0f]/95 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
                        <div className="font-bold text-white mb-2">{data.name}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Revenue:</span>
                            <span className="text-white font-mono">${data.x}M</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Growth:</span>
                            <span className="text-emerald-400 font-mono">{data.y}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-white/60">Valuation:</span>
                            <span className="text-cyan-400 font-mono">${data.z}M</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Competitors" data={marketData}>
                {marketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Competitor Matrix Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Competitive Analysis</h3>
              <p className="text-xs text-white/40">Market Positioning & Stats</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Focus</th>
                <th className="px-6 py-4">Valuation</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Growth</th>
                <th className="px-6 py-4">Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {competitors.map((c, i) => (
                <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${c.name === 'APEX OS' ? 'bg-cyan-500/5' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-white font-bold">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">{c.focus}</td>
                  <td className="px-6 py-4 text-white font-mono">${c.valuation}M</td>
                  <td className="px-6 py-4 text-white font-mono">${c.revenue}M</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.growth > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                      {c.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm">{c.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Market Opportunity Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Market Sizing (TAM)</h3>
              <p className="text-xs text-white/40">Total Addressable Market</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Global EdTech Market', value: '$400B', sub: 'TAM', width: '100%', color: 'bg-white/10' },
              { label: 'AI Learning Tools', value: '$45B', sub: 'SAM', width: '60%', color: 'bg-cyan-500/30' },
              { label: 'APEX Target Segment', value: '$1.2B', sub: 'SOM', width: '30%', color: 'bg-violet-500/40' },
            ].map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-bold">{m.label}</span>
                  <span className="text-white/60 font-mono">{m.value}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: m.width }}
                    transition={{ delay: 0.8 + i * 0.2, duration: 1 }}
                    className={`h-full ${m.color}`}
                  />
                </div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest text-right">{m.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 mb-4">
            <Zap className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">The Unfair Advantage</h3>
          <p className="text-white/60 text-sm max-w-xs">
            While incumbents focus on content delivery, APEX OS focuses on <span className="text-cyan-400 font-bold">Orchestration</span>. 
            We are building the infrastructure, not just the lessons.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-lg font-bold text-white">300%</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Efficiency</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-lg font-bold text-white">10x</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Scale</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComparablesTab;

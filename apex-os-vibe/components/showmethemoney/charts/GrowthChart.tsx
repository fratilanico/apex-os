import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
} from 'recharts';

interface GrowthChartProps {
  projections?: any[];
}

type Scenario = 'base' | 'monster' | 'bear';

const generateScenarioData = (scenario: Scenario) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const multipliers = {
    base: 1,
    monster: 1.8,
    bear: 0.6,
  };
  
  const m = multipliers[scenario];
  
  return months.map((month, idx) => {
    const monthNum = idx + 1;
    const baseMRR = Math.round(5000 * m * Math.pow(1.15, monthNum));
    const newRevenue = Math.round(baseMRR * 0.3);
    const cumulative = months.slice(0, monthNum).reduce((sum, _, i) => {
      return sum + Math.round(5000 * m * Math.pow(1.15, i + 1));
    }, 0);
    
    return {
      month,
      mrr: baseMRR,
      newRevenue,
      cumulative,
    };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-4 text-sm"
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <p className="text-white/60 mb-2 font-medium">{label} 2026</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/80">
              {entry.name}: {' '}
              <span className="font-bold" style={{ color: entry.color }}>
                ${entry.value?.toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const GrowthChart: React.FC<GrowthChartProps> = () => {
  const [scenario, setScenario] = useState<Scenario>('base');
  const data = generateScenarioData(scenario);
  
  const scenarioConfig = {
    base: {
      label: 'Base Case',
      color: '#22d3ee',
      description: 'Conservative growth trajectory',
    },
    monster: {
      label: 'Monster',
      color: '#10b981',
      description: 'Accelerated growth with viral coefficient',
    },
    bear: {
      label: 'Bear',
      color: '#f43f5e',
      description: 'Downside scenario with market headwinds',
    },
  };

  return (
    <div className="w-full">
      {/* Scenario Toggle */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(Object.keys(scenarioConfig) as Scenario[]).map((s) => (
          <motion.button
            key={s}
            onClick={() => setScenario(s)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              scenario === s
                ? 'text-white shadow-lg'
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{
              background: scenario === s
                ? `linear-gradient(135deg, ${scenarioConfig[s].color}40, ${scenarioConfig[s].color}20)`
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${scenario === s ? scenarioConfig[s].color : 'rgba(255, 255, 255, 0.1)'}`,
              boxShadow: scenario === s ? `0 0 20px ${scenarioConfig[s].color}30` : 'none',
            }}
          >
            {scenarioConfig[s].label}
          </motion.button>
        ))}
      </div>

      {/* Description */}
      <p className="text-center text-white/50 text-sm mb-6">
        {scenarioConfig[scenario].description}
      </p>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis 
              yAxisId="left"
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="mrr"
              name="MRR"
              stroke="#22d3ee"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mrrGradient)"
            />
            
            <Bar
              yAxisId="left"
              dataKey="newRevenue"
              name="New Revenue"
              fill="#a78bfa"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              name="Cumulative"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ fill: '#ffffff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#22d3ee' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;

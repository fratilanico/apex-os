import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { monthlyProjections } from '../../../data/financialModel';

interface FinancialTrajectoryChartProps {
  scenario?: 'base' | 'monster';
  showBurnRate?: boolean;
  height?: number;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const formatMonth = (month: number) => `M${month}`;

export const FinancialTrajectoryChart: React.FC<FinancialTrajectoryChartProps> = ({
  showBurnRate = true,
  height = 400,
}) => {
  const [, setHoveredMonth] = useState<number | null>(null);

  // Transform data for chart
  const chartData = useMemo(() => {
    return monthlyProjections.map((month) => ({
      month: month.month,
      monthLabel: month.monthLabel,
      revenue: month.monthlyRevenue,
      cumulative: month.cumulativeRevenue,
      mrr: month.mrr,
      expenses: month.totalExpenses,
      netCashFlow: month.netCashFlow,
      customers: month.totalCustomers,
      isProfitable: month.netCashFlow > 0,
    }));
  }, []);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const current = chartData[chartData.length - 1];
    const month6 = chartData.find((d) => d.month === 6);
    const month12 = chartData.find((d) => d.month === 12);

    return {
      totalRevenue: current?.cumulative || 0,
      currentMRR: current?.mrr || 0,
      growthRate: month12 && month6 
        ? ((month12.mrr - month6.mrr) / month6.mrr) * 100 
        : 0,
      isProfitable: current?.isProfitable || false,
      breakEvenMonth: chartData.find((d) => d.isProfitable)?.month || null,
    };
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0a0a0f]/95 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">{data.monthLabel}</span>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-white/60">Monthly Revenue:</span>
              <span className="text-emerald-400 font-mono">{formatCurrency(data.revenue)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/60">MRR:</span>
              <span className="text-cyan-400 font-mono">{formatCurrency(data.mrr)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-white/60">Cumulative:</span>
              <span className="text-violet-400 font-mono">{formatCurrency(data.cumulative)}</span>
            </div>
            {showBurnRate && (
              <div className="flex justify-between gap-4">
                <span className="text-white/60">Net Cash Flow:</span>
                <span className={`font-mono ${data.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(data.netCashFlow)}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-white/60">Customers:</span>
              <span className="text-amber-400 font-mono">{data.customers}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Header with Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(metrics.totalRevenue)}</div>
          <div className="text-xs text-emerald-400 mt-1">18-month projection</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">Current MRR</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(metrics.currentMRR)}</div>
          <div className="text-xs text-cyan-400 mt-1">Month 18</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider">Growth Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">+{metrics.growthRate.toFixed(0)}%</div>
          <div className="text-xs text-violet-400 mt-1">M6 to M12</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`bg-white/[0.02] backdrop-blur border rounded-2xl p-4 ${
            metrics.isProfitable ? 'border-emerald-500/30' : 'border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {metrics.isProfitable ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-white/60 text-xs uppercase tracking-wider">Break-Even</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.breakEvenMonth ? `M${metrics.breakEvenMonth}` : 'Not Yet'}
          </div>
          <div className={`text-xs mt-1 ${metrics.isProfitable ? 'text-emerald-400' : 'text-amber-400'}`}>
            {metrics.isProfitable ? '✓ Profitable' : 'Approaching...'}
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Financial Trajectory</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-white/60">Revenue</span>
            </div>
            {showBurnRate && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-xs text-white/60">Burn Rate</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ width: '100%', height }} className="touch-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onMouseMove={(e: any) => {
                if (e.activePayload) {
                  setHoveredMonth(e.activePayload[0].payload.month);
                }
              }}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                tickLine={false}
              />
              
              <YAxis
                tickFormatter={formatCurrency}
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                tickLine={false}
                width={60}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Milestone markers */}
              <ReferenceLine x={6} stroke="#a78bfa" strokeDasharray="3 3" opacity={0.5} />
              <ReferenceLine x={12} stroke="#22d3ee" strokeDasharray="3 3" opacity={0.5} />
              <ReferenceLine x={16} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />

              {/* Revenue Area */}
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                animationDuration={1500}
                animationEasing="ease-out"
              />

              {/* Burn Rate Area (if enabled) */}
              {showBurnRate && (
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#burnGradient)"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              )}

              {/* Milestone dots */}
              <ReferenceDot
                x={6}
                y={chartData.find(d => d.month === 6)?.cumulative || 0}
                r={6}
                fill="#a78bfa"
                stroke="none"
                label={{ value: 'M6', position: 'top', fill: '#a78bfa', fontSize: 10 }}
              />
              <ReferenceDot
                x={12}
                y={chartData.find(d => d.month === 12)?.cumulative || 0}
                r={6}
                fill="#22d3ee"
                stroke="none"
                label={{ value: 'M12', position: 'top', fill: '#22d3ee', fontSize: 10 }}
              />
              <ReferenceDot
                x={16}
                y={chartData.find(d => d.month === 16)?.cumulative || 0}
                r={6}
                fill="#10b981"
                stroke="none"
                label={{ value: 'M16', position: 'top', fill: '#10b981', fontSize: 10 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500/50" />
            <span>M6: Early Traction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500/50" />
            <span>M12: Product-Market Fit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <span>M16: Cash Flow Positive</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialTrajectoryChart;

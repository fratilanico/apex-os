import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartContainerProps {
  data?: any[];
  height?: number;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  data: _data,
  height = 300,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export const CustomTooltip = ({ active, payload, label }: any) => {
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
        <p className="text-white/60 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend };
export default ChartContainer;

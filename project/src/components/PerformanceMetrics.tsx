import React from 'react';
import { DollarSign, TrendingUp, BarChart2, PieChart } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-400 font-medium">{title}</h3>
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend && (
        <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

const PerformanceMetrics = () => {
  return (
    <>
      <MetricCard
        title="Daily P&L"
        value="$2,458.32"
        icon={DollarSign}
        trend={2.4}
      />
      <MetricCard
        title="Total P&L"
        value="$12,847.65"
        icon={TrendingUp}
        trend={15.7}
      />
      <MetricCard
        title="Win Rate"
        value="68%"
        icon={BarChart2}
      />
      <MetricCard
        title="Portfolio Value"
        value="$124,567.89"
        icon={PieChart}
        trend={0.8}
      />
    </>
  );
};

export default PerformanceMetrics;
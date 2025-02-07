import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownRight, DollarSign, Percent, TrendingUp } from 'lucide-react';
import PortfolioChart from './PortfolioChart';
import PositionsTable from './PositionsTable';
import MarketData from './MarketData';
import { fetchPortfolioSummary, fetchPositions } from '../services/api';

const Dashboard = () => {
  const { data: summary } = useQuery({
    queryKey: ['portfolio-summary'],
    queryFn: fetchPortfolioSummary,
    refetchInterval: 5000,
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    refetchInterval: 5000,
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${summary?.totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Daily P&L</p>
              <p className={`text-2xl font-bold mt-1 ${
                summary?.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {summary?.dailyPnL >= 0 ? '+' : '-'}${Math.abs(summary?.dailyPnL || 0).toLocaleString()}
              </p>
            </div>
            {summary?.dailyPnL >= 0 ? (
              <ArrowUpRight className="h-8 w-8 text-green-400" />
            ) : (
              <ArrowDownRight className="h-8 w-8 text-red-400" />
            )}
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-white mt-1">
                {summary?.winRate}%
              </p>
            </div>
            <Percent className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20 hover:border-blue-400/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold mt-1 ${
                summary?.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {summary?.totalPnL >= 0 ? '+' : '-'}${Math.abs(summary?.totalPnL || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Market Data Section */}
      <MarketData />

      {/* Chart */}
      <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Portfolio Performance</h2>
        <PortfolioChart />
      </div>

      {/* Positions Table */}
      <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Open Positions</h2>
        <PositionsTable positions={positions || []} />
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { fetchChartData } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#fff',
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(59, 130, 246, 0.1)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    y: {
      grid: {
        color: 'rgba(59, 130, 246, 0.1)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
  },
};

const PortfolioChart = () => {
  const { data: chartData } = useQuery({
    queryKey: ['chart-data'],
    queryFn: fetchChartData,
    refetchInterval: 5000,
  });

  if (!chartData) return null;

  return (
    <div className="h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default PortfolioChart;
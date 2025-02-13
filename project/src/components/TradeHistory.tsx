import React from 'react';
import { Table } from './ui/Table';

const TradeHistory = () => {
  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Symbol', accessor: 'symbol' },
    { header: 'Type', accessor: 'type' },
    { header: 'Price', accessor: 'price' },
    { header: 'P&L', accessor: 'pnl' },
  ];

  const data = [
    {
      date: '2024-03-15',
      symbol: 'SPY 400C',
      type: 'SELL',
      price: '$4.25',
      pnl: '+$245',
    },
    // Add more sample data as needed
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4">Trade History</h2>
      <div className="overflow-x-auto">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
};

export default TradeHistory;
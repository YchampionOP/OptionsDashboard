import React from 'react';
import { Table } from './ui/Table';

const OptionsPositions = ({ data }: any) => {
  const columns = [
    { header: 'Symbol', accessor: 'symbol' },
    { header: 'Strike', accessor: 'strike' },
    { header: 'Expiration', accessor: 'expiration' },
    { header: 'Type', accessor: 'type' },
    { header: 'Entry', accessor: 'entry' },
    { header: 'Current', accessor: 'current' },
    { header: 'P&L', accessor: 'pnl' },
    { header: 'Delta', accessor: 'delta' },
    { header: 'Theta', accessor: 'theta' },
    { header: 'Gamma', accessor: 'gamma' },
    { header: 'Vega', accessor: 'vega' },
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4">Active Positions</h2>
      <div className="overflow-x-auto">
        <Table columns={columns} data={data?.positions || []} />
      </div>
    </div>
  );
};

export default OptionsPositions;
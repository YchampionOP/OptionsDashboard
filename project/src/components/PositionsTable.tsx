import React from 'react';
import { Position } from '../types';
import { format } from 'date-fns';

interface PositionsTableProps {
  positions: Position[];
}

const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-500/20">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Strike
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Expiration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Cost Basis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Current Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              P&L
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-500/20">
          {positions.map((position) => (
            <tr key={position.id} className="hover:bg-blue-500/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {position.symbol}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {position.type.toUpperCase()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${position.strike}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {format(new Date(position.expiration), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {position.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${position.costBasis.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${position.currentPrice.toFixed(2)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {position.unrealizedPnL >= 0 ? '+' : '-'}$
                {Math.abs(position.unrealizedPnL).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsTable;
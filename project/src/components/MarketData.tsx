import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { fetchOptionQuote } from '../services/api';
import { OptionQuote, TopStock } from '../types';

// Hardcoded top trading stocks (replace with API data when available)
const TOP_STOCKS: TopStock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 2.30, changePercent: 1.34, volume: 52000000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.15, changePercent: 1.11, volume: 28000000 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 721.28, change: 15.32, changePercent: 2.17, volume: 35000000 },
  { symbol: 'META', name: 'Meta Platforms', price: 484.03, change: 7.89, changePercent: 1.66, volume: 18000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 1.45, changePercent: 1.03, volume: 25000000 },
];

const MarketData: React.FC = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState<TopStock | null>(null);

  const { data: optionQuote, isLoading, error } = useQuery({
    queryKey: ['optionQuote', searchSymbol],
    queryFn: () => fetchOptionQuote(searchSymbol),
    enabled: searchSymbol.length > 0,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger refetch by updating the search symbol
    setSearchSymbol(searchSymbol.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Market Search */}
      <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Search className="h-5 w-5 text-blue-400 mr-2" />
          Options Search
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            placeholder="Enter option symbol (e.g., AAPL250117C00150000)"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-blue-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 animate-glow"
          >
            Search
          </button>
        </form>

        {isLoading && <p className="text-gray-400 mt-4">Loading...</p>}
        {error && <p className="text-red-400 mt-4">Error fetching option data. Please try again.</p>}
        {optionQuote && (
          <div className="mt-4 p-4 rounded-lg bg-gray-700/50 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">Option Quote</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400">Bid</p>
                <p className="text-white font-semibold">${optionQuote.bid}</p>
              </div>
              <div>
                <p className="text-gray-400">Ask</p>
                <p className="text-white font-semibold">${optionQuote.ask}</p>
              </div>
              <div>
                <p className="text-gray-400">Last</p>
                <p className="text-white font-semibold">${optionQuote.last}</p>
              </div>
              <div>
                <p className="text-gray-400">Volume</p>
                <p className="text-white font-semibold">{optionQuote.volume}</p>
              </div>
              {optionQuote.impliedVolatility && (
                <div>
                  <p className="text-gray-400">IV</p>
                  <p className="text-white font-semibold">
                    {(optionQuote.impliedVolatility * 100).toFixed(2)}%
                  </p>
                </div>
              )}
              {optionQuote.delta && (
                <div>
                  <p className="text-gray-400">Delta</p>
                  <p className="text-white font-semibold">{optionQuote.delta.toFixed(3)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Top Trading Stocks */}
      <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
          Top Trading Stocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_STOCKS.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className="p-4 rounded-lg bg-gray-700/50 border border-blue-500/20 hover:border-blue-400/40 cursor-pointer transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{stock.symbol}</h3>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                </div>
                <div className={`flex items-center ${
                  stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stock.change >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{stock.changePercent.toFixed(2)}%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-white font-semibold">${stock.price}</p>
                </div>
                <div>
                  <p className="text-gray-400">Volume</p>
                  <p className="text-white font-semibold">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketData;
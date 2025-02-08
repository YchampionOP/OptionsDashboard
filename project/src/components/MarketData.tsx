import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight, Link } from 'lucide-react';
import { fetchOptionQuote, searchStocks, fetchStockQuote } from '../services/api';
import { OptionQuote, TopStock } from '../types';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const MarketData: React.FC = () => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<TopStock | null>(null);
  const [stockPrices, setStockPrices] = useState<any[]>([]);
  const [showBrokerageModal, setShowBrokerageModal] = useState(false);
  const [brokerageCredentials, setBrokerageCredentials] = useState({
    apiKey: '',
    apiSecret: ''
  });

  useEffect(() => {
    socket.on('stock-price-update', (data) => {
      setStockPrices(data);
    });

    return () => {
      socket.off('stock-price-update');
    };
  }, []);

  // Stock search
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const results = await searchStocks(searchQuery);
        setSearchResults(results);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const { data: optionQuote, isLoading, error } = useQuery({
    queryKey: ['optionQuote', searchSymbol],
    queryFn: () => fetchOptionQuote(searchSymbol),
    enabled: searchSymbol.length > 0,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSymbol(searchSymbol.toUpperCase());
  };

  const handleBrokerageConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/connect-brokerage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brokerageCredentials),
      });
      const data = await response.json();
      if (data.success) {
        alert('Successfully connected to brokerage account!');
        setShowBrokerageModal(false);
      }
    } catch (error) {
      alert('Failed to connect to brokerage account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Market Data</h2>
        <button
          onClick={() => setShowBrokerageModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Link className="h-4 w-4" />
          Connect Brokerage
        </button>
      </div>

      {/* Stock Search */}
      <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Search className="h-5 w-5 text-blue-400 mr-2" />
          Stock Search
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks (e.g., AAPL, Tesla, etc.)"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-blue-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchResults.length > 0 && searchQuery.length >= 2 && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-blue-500/20 rounded-lg shadow-lg">
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  className="p-3 hover:bg-blue-500/10 cursor-pointer border-b border-blue-500/10 last:border-b-0"
                  onClick={async () => {
                    setSearchQuery('');
                    setSearchResults([]);
                    const quote = await fetchStockQuote(result.symbol);
                    setSelectedStock({
                      symbol: result.symbol,
                      name: result.description,
                      price: quote.price,
                      change: quote.change,
                      changePercent: quote.changePercent,
                      volume: 0
                    });
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{result.symbol}</p>
                      <p className="text-sm text-gray-400">{result.description}</p>
                    </div>
                    <div className="text-sm text-gray-400">{result.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Options Search */}
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
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
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
                <p className="text-white font-semibold">${optionQuote.bid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Ask</p>
                <p className="text-white font-semibold">${optionQuote.ask.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Last</p>
                <p className="text-white font-semibold">${optionQuote.last.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Volume</p>
                <p className="text-white font-semibold">{optionQuote.volume.toLocaleString()}</p>
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

      {/* Real-time Stock Prices */}
      <div className="p-6 rounded-lg bg-gray-800 border border-blue-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-400 mr-2" />
          Real-time Stock Prices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockPrices.map((stock) => (
            <div
              key={stock.symbol}
              className="p-4 rounded-lg bg-gray-700/50 border border-blue-500/20 hover:border-blue-400/40 cursor-pointer transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{stock.symbol}</h3>
                </div>
                <div className="flex items-center text-green-400">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>${stock.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-400">Volume</p>
                  <p className="text-white font-semibold">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Time</p>
                  <p className="text-white font-semibold">
                    {new Date(stock.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brokerage Connection Modal */}
      {showBrokerageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold text-white mb-4">Connect Brokerage Account</h3>
            <form onSubmit={handleBrokerageConnect}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">API Key</label>
                  <input
                    type="text"
                    value={brokerageCredentials.apiKey}
                    onChange={(e) => setBrokerageCredentials(prev => ({...prev, apiKey: e.target.value}))}
                    className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">API Secret</label>
                  <input
                    type="password"
                    value={brokerageCredentials.apiSecret}
                    onChange={(e) => setBrokerageCredentials(prev => ({...prev, apiSecret: e.target.value}))}
                    className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBrokerageModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketData;
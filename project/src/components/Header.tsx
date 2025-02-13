import React from 'react';
import { Power, AlertCircle, TrendingUp } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

const Header = ({ isConnected }: HeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white">Options Trading Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-red-500">Disconnected</span>
                </>
              )}
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Connect Broker
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
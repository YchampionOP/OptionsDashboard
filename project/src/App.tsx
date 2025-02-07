import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/Dashboard';
import { BarChart3, Activity } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="bg-gray-800 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">Options PnL Dashboard</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30">
                  <Activity className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-400 text-sm">Live</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
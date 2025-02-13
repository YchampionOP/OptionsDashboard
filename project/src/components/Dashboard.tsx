import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, History, Plus } from 'lucide-react';
import Header from './Header';
import PerformanceMetrics from './PerformanceMetrics';
import OptionsPositions from './OptionsPositions';
import TradeHistory from './TradeHistory';
import NewPositionForm from './NewPositionForm';
import TradingViewChart from './TradingViewChart';

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [optionsData, setOptionsData] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws/options-data');
    
    websocket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOptionsData(data);
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    websocket.onclose = () => {
      setIsConnected(false);
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header isConnected={isConnected} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <PerformanceMetrics />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <TradingViewChart />
            <OptionsPositions data={optionsData} />
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <NewPositionForm />
            <TradeHistory />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
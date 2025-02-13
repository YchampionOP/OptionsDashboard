import React, { useEffect } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new window.TradingView.widget({
        width: '100%',
        height: 500,
        symbol: 'SPY',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1f2937',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: 'tradingview_chart',
        hide_volume: false,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
      <div id="tradingview_chart" className="w-full h-[500px]" />
    </div>
  );
};

export default TradingViewChart;
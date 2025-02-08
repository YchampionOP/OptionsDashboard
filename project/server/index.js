import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import WebSocket from 'ws';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Finnhub configuration
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY'; // Replace with your key
const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;

// WebSocket connection to Finnhub
const finnhubWs = new WebSocket(FINNHUB_WS_URL);

// Store latest stock prices
let stockPrices = new Map();

finnhubWs.on('open', function() {
    console.log('Connected to Finnhub WebSocket');
    // Subscribe to stock symbols
    ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'].forEach(symbol => {
        finnhubWs.send(JSON.stringify({'type': 'subscribe', 'symbol': symbol}));
    });
});

finnhubWs.on('message', function(data) {
    const parsedData = JSON.parse(data);
    if (parsedData.type === 'trade') {
        parsedData.data.forEach(trade => {
            stockPrices.set(trade.s, {
                symbol: trade.s,
                price: trade.p,
                timestamp: trade.t,
                volume: trade.v
            });
        });
        // Emit updated prices to all connected clients
        io.emit('stock-price-update', Array.from(stockPrices.values()));
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Options Trading PnL Dashboard API' });
});

// Sample data generators
const generateSampleData = () => ({
  totalValue: 250000 + Math.random() * 10000,
  dailyPnL: 5000 + Math.random() * 2000 * (Math.random() > 0.5 ? 1 : -1),
  totalPnL: 25000 + Math.random() * 5000,
  positions: 8,
  winRate: 68
});

const generatePositions = () => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
  return symbols.map((symbol, index) => ({
    id: `pos-${index}`,
    symbol,
    type: Math.random() > 0.5 ? 'call' : 'put',
    strike: 100 + Math.random() * 100,
    expiration: new Date(Date.now() + Math.random() * 7776000000).toISOString(),
    quantity: Math.floor(Math.random() * 10) + 1,
    costBasis: 1000 + Math.random() * 500,
    currentPrice: 1000 + Math.random() * 1000,
    unrealizedPnL: Math.random() * 1000 * (Math.random() > 0.5 ? 1 : -1)
  }));
};

const generateChartData = () => {
  const labels = Array.from({ length: 30 }, (_, i) => 
    new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString()
  );
  
  return {
    labels,
    datasets: [{
      label: 'Portfolio Value',
      data: Array.from({ length: 30 }, () => 200000 + Math.random() * 100000),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    }]
  };
};

// Generate sample option data
const generateOptionData = (symbol) => ({
  symbol,
  bid: 2.15 + Math.random(),
  ask: 2.35 + Math.random(),
  last: 2.25 + Math.random(),
  volume: Math.floor(1000 + Math.random() * 5000),
  openInterest: Math.floor(5000 + Math.random() * 10000),
  delta: 0.45 + Math.random() * 0.1,
  gamma: 0.03 + Math.random() * 0.01,
  theta: -0.03 - Math.random() * 0.01,
  vega: 0.25 + Math.random() * 0.05,
  impliedVolatility: 0.3 + Math.random() * 0.1
});

// API endpoints
app.get('/api/market/options/:symbol', (req, res) => {
  const { symbol } = req.params;
  res.json(generateOptionData(symbol));
});

app.get('/api/market/stock/:symbol', async (req, res) => {
  try {
    const stockPrice = stockPrices.get(req.params.symbol);
    if (stockPrice) {
      res.json(stockPrice);
    } else {
      throw new Error('Stock price not found');
    }
  } catch (error) {
    // Return sample data if real data is not available
    res.json({
      symbol: req.params.symbol,
      price: 150 + Math.random() * 50,
      change: (Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
      volume: Math.floor(1000000 + Math.random() * 5000000)
    });
  }
});

app.get('/api/market/stocks/top', async (req, res) => {
  try {
    const topStocks = Array.from(stockPrices.values());
    if (topStocks.length > 0) {
      res.json(topStocks);
    } else {
      throw new Error('No stock prices available');
    }
  } catch (error) {
    // Return sample data if real data is not available
    const sampleData = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50 + Math.random() * 5, change: 2.30 + Math.random(), volume: 52000000 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85 + Math.random() * 5, change: 4.15 + Math.random(), volume: 28000000 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 721.28 + Math.random() * 10, change: 15.32 + Math.random(), volume: 35000000 },
      { symbol: 'META', name: 'Meta Platforms', price: 484.03 + Math.random() * 5, change: 7.89 + Math.random(), volume: 18000000 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80 + Math.random() * 3, change: 1.45 + Math.random(), volume: 25000000 }
    ];
    res.json(sampleData);
  }
});

app.get('/api/portfolio/summary', (req, res) => {
  res.json(generateSampleData());
});

app.get('/api/positions', (req, res) => {
  res.json(generatePositions());
});

app.get('/api/portfolio/chart', (req, res) => {
  res.json(generateChartData());
});

// Add new endpoint for brokerage connection status
app.post('/api/connect-brokerage', (req, res) => {
    const { apiKey, apiSecret } = req.body;
    // Here you would implement actual brokerage connection logic
    res.json({ 
        success: true, 
        message: 'Successfully connected to brokerage account'
    });
});

// WebSocket updates
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Portfolio updates
  const portfolioInterval = setInterval(() => {
    socket.emit('portfolio-update', generateSampleData());
    socket.emit('positions-update', generatePositions());
  }, 5000);

  // Market data updates
  const marketDataInterval = setInterval(() => {
    const sampleData = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50 + Math.random() * 5, change: 2.30 + Math.random(), volume: 52000000 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85 + Math.random() * 5, change: 4.15 + Math.random(), volume: 28000000 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 721.28 + Math.random() * 10, change: 15.32 + Math.random(), volume: 35000000 },
      { symbol: 'META', name: 'Meta Platforms', price: 484.03 + Math.random() * 5, change: 7.89 + Math.random(), volume: 18000000 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80 + Math.random() * 3, change: 1.45 + Math.random(), volume: 25000000 }
    ];
    socket.emit('market-data-update', sampleData);
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(portfolioInterval);
    clearInterval(marketDataInterval);
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
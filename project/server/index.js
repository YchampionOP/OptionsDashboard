import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';

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

// MarketData.app configuration
const MARKET_DATA_API_KEY = 'Tk5wcWNZSmt3cm5mVEVYYkM4T0ZaR21xRkZoMmk0NFpQSjRILTd3UUtyND0';
const MARKET_DATA_BASE_URL = 'https://api.marketdata.app/v1';

// Middleware
app.use(cors());
app.use(express.json());

// Sample data (for portfolio features)
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

// MarketData.app API endpoints
app.get('/api/market/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `${MARKET_DATA_BASE_URL}/stocks/quotes/${symbol}/?token=${MARKET_DATA_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/api/market/stocks/top', async (req, res) => {
  try {
    // Fetch quotes for top stocks
    const symbols = ['SPY', 'AAPL', 'MSFT', 'NVDA', 'META', 'GOOGL', 'AMZN', 'TSLA'];
    const response = await axios.get(
      `${MARKET_DATA_BASE_URL}/stocks/quotes/${symbols.join(',')}/?token=${MARKET_DATA_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching top stocks:', error);
    res.status(500).json({ error: 'Failed to fetch top stocks data' });
  }
});

// Existing portfolio endpoints
app.get('/api/portfolio/summary', (req, res) => {
  res.json(generateSampleData());
});

app.get('/api/positions', (req, res) => {
  res.json(generatePositions());
});

app.get('/api/portfolio/chart', (req, res) => {
  res.json(generateChartData());
});

// WebSocket updates for real-time data
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Portfolio updates
  const portfolioInterval = setInterval(() => {
    socket.emit('portfolio-update', generateSampleData());
    socket.emit('positions-update', generatePositions());
  }, 5000);

  // Market data updates
  const marketDataInterval = setInterval(async () => {
    try {
      const symbols = ['SPY', 'AAPL', 'MSFT', 'NVDA', 'META'];
      const response = await axios.get(
        `${MARKET_DATA_BASE_URL}/stocks/quotes/${symbols.join(',')}/?token=${MARKET_DATA_API_KEY}`
      );
      socket.emit('market-data-update', response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }, 10000);

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
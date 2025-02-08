import axios from 'axios';
import { Position, PortfolioSummary, ChartData, OptionQuote } from '../types';
const API_BASE_URL = 'http://localhost:3001/api';
const FINNHUB_API_KEY = 'cujiidhr01qm7p9o7fc0cujiidhr01qm7p9o7fcg';

// Portfolio API calls
export const fetchPortfolioSummary = async (): Promise<PortfolioSummary> => {
  const { data } = await axios.get(`${API_BASE_URL}/portfolio/summary`);
  return data;
};

export const fetchPositions = async (): Promise<Position[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/positions`);
  return data;
};

export const fetchChartData = async (): Promise<ChartData> => {
  const { data } = await axios.get(`${API_BASE_URL}/portfolio/chart`);
  return data;
};

// Finnhub API calls
export const searchStocks = async (query: string) => {
  try {
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`
    );
    return data.result;
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

export const fetchStockQuote = async (symbol: string) => {
  try {
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    return {
      symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

export const fetchOptionQuote = async (symbol: string): Promise<OptionQuote> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/market/options/${symbol}`);
    return data;
  } catch (error) {
    return {
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
    };
  }
};
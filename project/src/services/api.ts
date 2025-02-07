import axios from 'axios';
import { Position, PortfolioSummary, ChartData, OptionQuote } from '../types';
const API_BASE_URL = 'http://localhost:3001/api';

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

// Market Data API calls
export const fetchStockQuote = async (symbol: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/market/stock/${symbol}`);
    return data;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

export const fetchTopStocks = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/market/stocks/top`);
    return data;
  } catch (error) {
    console.error('Error fetching top stocks:', error);
    throw error;
  }
};

export const fetchOptionQuote = async (symbol: string): Promise<OptionQuote> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/market/options/${symbol}`);
    return data;
  } catch (error) {
    console.error('Error fetching option quote:', error);
    throw error;
  }
};
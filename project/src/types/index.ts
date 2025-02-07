export interface Position {
  id: string;
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  quantity: number;
  costBasis: number;
  currentPrice: number;
  unrealizedPnL: number;
}

export interface PortfolioSummary {
  totalValue: number;
  dailyPnL: number;
  totalPnL: number;
  positions: number;
  winRate: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface OptionQuote {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  impliedVolatility?: number;
}

export interface TopStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}
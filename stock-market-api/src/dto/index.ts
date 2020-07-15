import { TransactionTypes } from '../entities/stock-transaction.entity';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateStockDto {
  name: string;
  ticker: string;
  marketPrice: number;
  numberOfShares: number;
  costBasis: number;
}

export interface CreateStockTransactionDto {
  date: string;
  transactionType: TransactionTypes;
  numberOfShares: number;
  price: number;
  fees: number;
}

export interface StockStatistics {
  name: string;
  ticker: string;
  totalEarnings: number;
}

export interface PortfolioStatistics {
  name: string;
  totalEarnings: number;
  marketValue: number;
  amountInvested: number;
  stocks: Array<StockStatistics>;
}

export interface AnnualDividends {
  [name: number]: {
    totalDividends: number;
    months: {
      [month: string]: number;
    };
  };
}

export interface Statistics {
  amountInvested: number;
  totalEarnings: number;
  portfolios: Array<PortfolioStatistics>;
  dividendCollected: number;
  annualDividends: AnnualDividends;
  currentYield: number;
}

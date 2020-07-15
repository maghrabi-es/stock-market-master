import { Controller, Get } from '@nestjs/common';
import { AnnualDividends, ApiResponse, PortfolioStatistics, Statistics } from '../dto';
import { PortfolioService } from '../portfolio/portfolio.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import StockTransactionEntity, { TransactionTypes } from '../entities/stock-transaction.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private portfolioService: PortfolioService,
    @InjectRepository(PortfolioEntity)
    private portfolioRepository: Repository<PortfolioEntity>,
    @InjectRepository(StockTransactionEntity)
    private transactionEntity: Repository<StockTransactionEntity>,
  ) {}

  @Get()
  async getStatistics(): Promise<ApiResponse<Statistics>> {
    let portfolios = await this.portfolioRepository.find();

    await Promise.all(portfolios.map(portfolio => this.portfolioService.refreshPortfolio(portfolio.id)));

    portfolios = await this.portfolioRepository.find({ relations: ['stocks', 'stocks.transactions'] });

    const portfolioInformation: Array<PortfolioStatistics> = portfolios.map(portfolio => {
      return {
        name: portfolio.name,
        marketValue: portfolio.marketValue,
        totalEarnings: portfolio.stocks.reduce((acc, cur) => acc + cur.totalGainOrLoss, 0),
        amountInvested: portfolio.stocks.reduce((acc, cur) => acc + cur.costBasis, 0),
        stocks: portfolio.stocks.map(stock => {
          return {
            name: stock.name,
            ticker: stock.ticker,
            totalEarnings: stock.totalGainOrLoss,
          };
        }),
      };
    });

    const amountInvested = portfolioInformation.reduce((acc, cur) => acc + cur.amountInvested, 0);
    const totalEarnings = portfolioInformation.reduce((acc, cur) => acc + cur.totalEarnings, 0);
    const annualDividends: AnnualDividends = await this.calculateAnnualDividends();
    const dividendCollected = Object.values(annualDividends).reduce((acc, cur) => acc + cur.totalDividends, 0);

    const statistics: Statistics = {
      amountInvested,
      totalEarnings,
      portfolios: portfolioInformation,
      annualDividends,
      dividendCollected,
      currentYield: (dividendCollected / amountInvested) * 100,
    };

    return {
      data: statistics,
    };
  }

  private async calculateAnnualDividends(): Promise<AnnualDividends> {
    const transactions = await this.transactionEntity.find({ where: { transactionType: TransactionTypes.DIVIDEND } });
    const dividends: AnnualDividends = {};

    transactions.forEach(transaction => {
      const year = moment(transaction.date).year();
      const month = moment(transaction.date).format('MMMM');
      if (!dividends[year]) {
        dividends[year] = {
          totalDividends: 0,
          months: {},
        };
      }
      const currentTotal = dividends[year].months[month] || 0;
      const yearTotal = dividends[year].totalDividends || 0;

      dividends[year].months[month] = currentTotal + transaction.price - transaction.fees;
      dividends[year].totalDividends = yearTotal + transaction.price - transaction.fees;
    });

    return dividends;
  }
}

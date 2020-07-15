import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StockEntity from '../entities/stock.entity';
import { PortfolioEntity } from '../entities/portfolio.entity';
import StockTransactionEntity, { TransactionTypes } from '../entities/stock-transaction.entity';
import WatchlistEntity from '../entities/watchlist.entity';
import AlertEntity from '../entities/alert.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
    @InjectRepository(PortfolioEntity)
    private portfolioRepository: Repository<PortfolioEntity>,
    @InjectRepository(AlertEntity)
    private alertRepository: Repository<AlertEntity>,
  ) {}

  /**
   * Refresh all the stock information in the portfolio
   * @param id
   */
  async refreshPortfolio(id: number): Promise<PortfolioEntity> {
    const portfolio = await this.portfolioRepository.findOne({ where: { id }, relations: ['stocks', 'stocks.transactions', 'stocks.watchList'] });
    const { stocks } = portfolio;

    const marketValues = await Promise.all(stocks.map(this.refreshStock));
    const totalMarketValue = marketValues.reduce((acc, cur) => acc + cur, 0);

    // update the stock market weight
    stocks.map(stock => {
      stock.marketWeight = (stock.marketValue / totalMarketValue) * 100;
    });

    portfolio.marketValue = totalMarketValue;

    // update all stocks to the database
    await this.stockRepository.save(stocks);
    await this.portfolioRepository.save(portfolio);

    return portfolio;
  }

  private async refreshStock(stock: StockEntity): Promise<number> {
    const { transactions } = stock;

    const buy = transactions.filter(transaction => transaction.transactionType === TransactionTypes.BUY);
    const sell = transactions.filter(transaction => transaction.transactionType === TransactionTypes.SELL);
    const dividend = transactions.filter(transaction => transaction.transactionType === TransactionTypes.DIVIDEND);

    const numSharesBought = buy.reduce((acc, cur) => acc + cur.numberOfShares, 0) || 0;
    const numSharesSold = sell.reduce((acc, cur) => acc + cur.numberOfShares, 0) || 0;
    const dividendCollected = dividend.reduce((acc, cur) => acc + cur.price, 0) || 0;

    const sharesBought = buy.reduce((acc, cur) => acc + cur.fees + cur.price, 0) || 0;
    const sharesSold = sell.reduce((acc, cur) => acc - cur.fees + cur.price, 0) || 0;

    const numberOfShares = numSharesBought - numSharesSold;

    const sellingPrice = PortfolioService.calculateSellingPrice(numSharesSold, buy) || 0;

    const totalCost = sharesBought - sellingPrice;

    stock.numberOfShares = numberOfShares;
    stock.costBasis = totalCost;
    stock.marketValue = numberOfShares * stock.marketPrice;
    stock.costPerShare = numSharesBought === 0 ? 0 : sharesBought / numSharesBought;
    stock.unrealizedGainOrLoss = stock.marketValue - totalCost;
    stock.unrealizedGainOrLossPercentage = totalCost ? (stock.unrealizedGainOrLoss * 100) / totalCost : 0;
    stock.realizedGainOrLoss = sharesSold - sellingPrice;
    stock.realizedGainOrLossPercentage = sharesSold ? (stock.realizedGainOrLoss * 100) / sharesSold : 0;
    stock.dividends = dividendCollected;
    stock.dividendsPercentage = totalCost === 0 ? 0 : (dividendCollected * 100) / totalCost;
    stock.totalGainOrLoss = dividendCollected + stock.realizedGainOrLoss;

    return stock.marketValue;
  }

  static calculateSellingPrice(numSold: number, bought: Array<StockTransactionEntity>): number {
    let total = 0;
    for (let i = 0; i < bought.length && numSold > 0; i++) {
      const transaction = bought[i];
      const shares = Math.min(transaction.numberOfShares, numSold);

      total += shares * (transaction.price / transaction.numberOfShares);
      numSold -= shares;
    }
    return total;
  }

  /**
   * Loop through all the watchLists in a portfolio and generate alerts
   * @param id
   */
  async generateAlerts(id: number): Promise<void> {
    const { watchLists } = await this.portfolioRepository.findOneOrFail({ where: { id }, relations: ['watchLists', 'watchLists.stocks'] });
    await Promise.all(
      watchLists.map(watchList => {
        return this.generateWatchListAlert(watchList);
      }),
    );
  }

  private async generateWatchListAlert(watchList: WatchlistEntity) {
    if (watchList.maxAlertStockPrice > 0) {
      // check if stocks reached a specific price
      watchList.stocks.map(async stock => {
        if (stock.marketValue > watchList.maxAlertStockPrice) {
          const alertId = `alert-${watchList.maxAlertStockPrice}-${stock.id}-${watchList.id}`;

          const alert = await this.alertRepository.findOne({ where: { alertId } });

          // if an alert already exists, don't create it
          if (!alert) {
            await this.alertRepository.save({
              message: 'The stock [' + stock.name + "]'s market value has reached " + watchList.maxAlertStockPrice,
              alertId,
              watchList,
            });
          }
        }
      });
    }
  }
}

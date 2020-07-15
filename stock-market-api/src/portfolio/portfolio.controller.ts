import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { Repository } from 'typeorm';
import { ApiResponse, CreateStockDto } from '../dto';
import StockEntity from '../entities/stock.entity';
import StockTransactionEntity, { TransactionTypes } from '../entities/stock-transaction.entity';
import { PortfolioService } from './portfolio.service';
import WatchlistEntity from '../entities/watchlist.entity';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    @InjectRepository(PortfolioEntity)
    private portfolioRepository: Repository<PortfolioEntity>,
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
    @InjectRepository(StockTransactionEntity)
    private transactionRepository: Repository<StockTransactionEntity>,
    @InjectRepository(WatchlistEntity)
    private watchListRepository: Repository<WatchlistEntity>,
    private portfolioService: PortfolioService,
  ) {}

  /**
   * This method allows us to create a portfolio.
   * The requirement for creating a portfolio is a name
   *
   * It returns the portfolio object that has been created.
   */
  @Post()
  async createPortfolio(@Body('name') name: string): Promise<ApiResponse<PortfolioEntity>> {
    const portfolio = this.portfolioRepository.create({ name });

    await this.portfolioRepository.save(portfolio);

    return {
      data: { ...portfolio, stocks: [] },
      message: 'Portfolio has been created.',
    };
  }

  @Get(':id')
  async getPortfolio(@Param('id') id: number): Promise<ApiResponse<PortfolioEntity>> {
    const portfolio = await this.portfolioRepository.findOneOrFail({ where: { id } });

    await this.portfolioService.generateAlerts(id);

    return {
      data: portfolio,
    };
  }

  /**
   * Fetch a list of portfolios.
   *
   * It returns a list of portfolio objects
   */
  @Get()
  async getAllPortfolios(): Promise<ApiResponse<PortfolioEntity[]>> {
    return {
      data: await this.portfolioRepository.find(),
    };
  }

  /**
   * Create a portfolio stock item.
   *
   * The stock will be tied to the portfolio whose id has been provided.
   *
   * @param createStockDto - the data for the stock item
   * @param portfolioId - the id of the portfolio to add the stock to
   *
   * @return the stock that was created.
   */
  @Post(':id/stocks')
  async createStock(@Body() createStockDto: CreateStockDto, @Param('id') portfolioId: string): Promise<ApiResponse<StockEntity>> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
    });
    const stock = this.stockRepository.create({
      name: createStockDto.name,
      ticker: createStockDto.ticker,
      marketPrice: createStockDto.marketPrice,
    });
    stock.portfolio = portfolio;

    await this.stockRepository.save(stock);

    // create the first transaction
    const transaction = this.transactionRepository.create({
      date: new Date(),
      transactionType: TransactionTypes.BUY,
      numberOfShares: createStockDto.numberOfShares,
      price: createStockDto.costBasis,
      stock,
      fees: 0,
    });

    await this.transactionRepository.save(transaction);

    await this.portfolioService.refreshPortfolio(portfolio.id);

    return {
      data: await this.stockRepository.findOne({ where: { id: stock.id } }),
      message: 'Stock has been created.',
    };
  }

  /**
   * Get a list of all stocks in this portfolio
   *
   * @param id - the id of the portfolio
   *
   * @return the list of stocks in the portfolio
   */
  @Get(':id/stocks')
  async allStockInPortfolio(@Param('id') id: number): Promise<ApiResponse<StockEntity[]>> {
    const { stocks } = await this.portfolioService.refreshPortfolio(id);

    return { data: stocks };
  }

  /**
   * Create a watchlist in a portfolio
   *
   * @param name - the name of the watchlist
   * @param id - the id of the portfolio
   */
  @Post(':id/watch-lists')
  async createWatchList(@Body('name') name: string, @Param('id') id: number): Promise<ApiResponse<WatchlistEntity>> {
    const portfolio = await this.portfolioRepository.findOne({ where: { id } });

    return {
      data: await this.watchListRepository.save({
        name,
        portfolio,
      }),
      message: 'Watchlist has been created.',
    };
  }

  @Get(':id/watch-lists')
  async getAllWatchLists(@Param('id') id: number): Promise<ApiResponse<WatchlistEntity[]>> {
    const { watchLists } = await this.portfolioRepository.findOne({ where: { id }, relations: ['watchLists', 'watchLists.stocks'] });

    return {
      data: watchLists,
    };
  }

  @Delete(':id')
  async deletePortfolio(@Param('id') id: number): Promise<ApiResponse<null>> {
    const portfolio = await this.portfolioRepository.findOneOrFail({ where: { id } });

    await this.portfolioRepository.remove(portfolio);

    return {
      message: 'Portfolio has been deleted.',
    };
  }

  @Put(':id')
  async renamePortfolio(@Param('id') id: number, @Body('name') name: string): Promise<ApiResponse<PortfolioEntity>> {
    const portfolio = await this.portfolioRepository.findOneOrFail({ where: { id } });

    portfolio.name = name;

    this.portfolioRepository.save(portfolio);

    return {
      data: portfolio,
    };
  }
}

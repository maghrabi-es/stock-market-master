import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import WatchlistEntity from '../entities/watchlist.entity';
import { Repository } from 'typeorm';
import StockEntity from '../entities/stock.entity';
import { ApiResponse } from '../dto';
import AlertEntity from '../entities/alert.entity';
import { PortfolioService } from '../portfolio/portfolio.service';

@Controller('watch-lists')
export class WatchListsController {
  constructor(
    @InjectRepository(WatchlistEntity)
    private watchListRepository: Repository<WatchlistEntity>,
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
    private portfolioService: PortfolioService,
  ) {}

  /**
   * Add an item to the watch list
   * @param id
   * @param stockId
   */
  @Post(':id/')
  async addItem(@Param('id') id: number, @Body('stockId') stockId: number): Promise<ApiResponse<WatchlistEntity>> {
    let watchList = await this.watchListRepository.findOne({ where: { id } });

    const stock = await this.stockRepository.findOneOrFail({ where: { id: stockId } });
    stock.watchList = watchList;

    await this.stockRepository.save(stock);

    watchList = await this.watchListRepository.findOne({ where: { id }, relations: ['stocks'] });

    return {
      data: watchList,
      message: 'Stock added to watchlist',
    };
  }

  @Get(':id')
  async getWatchList(@Param('id') id: number): Promise<ApiResponse<WatchlistEntity>> {
    const watchList = await this.watchListRepository.findOneOrFail({ where: { id }, relations: ['stocks', 'portfolio', 'alerts'] });
    return {
      data: watchList,
    };
  }

  @Delete(':id')
  async deleteWatchList(@Param('id') id: number): Promise<ApiResponse<null>> {
    const watchList = await this.watchListRepository.findOneOrFail({ where: { id }, relations: ['stocks'] });

    await Promise.all(
      watchList.stocks.map(stock => {
        stock.watchList = null;
        return this.stockRepository.save(stock);
      }),
    );

    await this.watchListRepository.remove(watchList);

    return {
      message: 'Watch list has been removed.',
    };
  }

  @Put(':id')
  async updateWatchList(@Param('id') id: number, @Body('name') name: string): Promise<ApiResponse<WatchlistEntity>> {
    const watchList = await this.watchListRepository.findOneOrFail({ where: { id } });

    watchList.name = name;

    await this.watchListRepository.save(watchList);

    return {
      data: watchList,
    };
  }

  @Get(':id/alerts')
  async getWatchListAlerts(@Param('id') id: number): Promise<ApiResponse<AlertEntity[]>> {
    const watchList = await this.watchListRepository.findOneOrFail({ where: { id }, relations: ['portfolio'] });
    await this.portfolioService.generateAlerts(watchList.portfolio.id);

    const { alerts } = await this.watchListRepository.findOneOrFail({ where: { id }, relations: ['alerts'] });

    return {
      data: alerts,
    };
  }

  @Post(':id/alerts')
  async createAlert(@Body('maxAlertStockPrice') maxAlertStockPrice: number, @Param('id') id: number): Promise<ApiResponse> {
    const watchList = await this.watchListRepository.findOneOrFail({ where: { id } });
    watchList.maxAlertStockPrice = maxAlertStockPrice;

    await this.watchListRepository.save(watchList);
    return {
      message: 'Alert for watchlist has been added',
    };
  }
}

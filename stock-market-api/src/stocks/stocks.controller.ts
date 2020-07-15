import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StockEntity from '../entities/stock.entity';
import { Repository } from 'typeorm';
import { ApiResponse, CreateStockTransactionDto } from '../dto';
import StockTransactionEntity from '../entities/stock-transaction.entity';
import * as moment from 'moment';
import WatchlistEntity from '../entities/watchlist.entity';

@Controller('stocks')
export class StocksController {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
    @InjectRepository(StockTransactionEntity)
    private transactionRepository: Repository<StockTransactionEntity>,
    @InjectRepository(WatchlistEntity)
    private watchListRepository: Repository<WatchlistEntity>,
  ) {}

  /**
   * Delete a stock
   *
   * @param stockId - provide a stock id to delete
   *
   * @return a message showing that the stock was deleted.
   */
  @Delete(':id')
  async deleteStock(@Param('id') stockId: string): Promise<ApiResponse> {
    const stock = await this.stockRepository.findOne({
      where: { id: stockId },
    });

    if (stock) {
      await this.stockRepository.remove(stock);
    }

    return {
      message: 'Stock has been deleted',
    };
  }

  @Get(':id')
  async getStock(@Param('id') id: string): Promise<ApiResponse<StockEntity>> {
    const stock = await this.stockRepository.findOneOrFail({
      where: { id },
      relations: ['transactions'],
    });

    return {
      data: stock,
    };
  }

  /**
   * Add a new stock transaction
   * The transaction will be tied to the stock id specified
   *
   * @param transactionDto - the stock transaction information
   * @param id  - the stock id
   *
   * @return the stock transaction details
   *
   */
  @Post(':id/transactions')
  async addTransaction(@Body() transactionDto: CreateStockTransactionDto, @Param('id') id: string): Promise<ApiResponse<StockTransactionEntity>> {
    const stock = await this.stockRepository.findOne({ where: { id } });

    const transaction = this.transactionRepository.create({ ...transactionDto, date: moment(transactionDto.date, 'YYYY-MM-DD').toDate(), stock });

    await this.transactionRepository.save(transaction);

    return {
      data: transaction,
    };
  }
}

import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import StockEntity from '../entities/stock.entity';
import StockTransactionEntity from '../entities/stock-transaction.entity';
import WatchlistEntity from '../entities/watchlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity, StockTransactionEntity, WatchlistEntity])],
  controllers: [StocksController],
})
export class StocksModule {}

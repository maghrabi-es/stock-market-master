import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioEntity } from '../entities/portfolio.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import StockEntity from '../entities/stock.entity';
import StockTransactionEntity from '../entities/stock-transaction.entity';
import WatchlistEntity from '../entities/watchlist.entity';
import AlertEntity from '../entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntity, StockEntity, StockTransactionEntity, WatchlistEntity, AlertEntity])],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}

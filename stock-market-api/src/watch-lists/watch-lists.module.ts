import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListsController } from './watch-lists.controller';
import WatchlistEntity from '../entities/watchlist.entity';
import StockEntity from '../entities/stock.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { PortfolioEntity } from '../entities/portfolio.entity';
import AlertEntity from '../entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WatchlistEntity, StockEntity, PortfolioEntity, AlertEntity])],
  providers: [PortfolioService],
  controllers: [WatchListsController],
})
export class WatchListsModule {}

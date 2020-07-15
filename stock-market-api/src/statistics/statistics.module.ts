import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioEntity } from '../entities/portfolio.entity';
import StockEntity from '../entities/stock.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import AlertEntity from '../entities/alert.entity';
import StockTransactionEntity from '../entities/stock-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntity, StockEntity, AlertEntity, StockTransactionEntity])],
  providers: [PortfolioService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}

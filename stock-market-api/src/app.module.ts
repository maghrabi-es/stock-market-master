import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioModule } from './portfolio/portfolio.module';
import { StocksModule } from './stocks/stocks.module';
import { WatchListsModule } from './watch-lists/watch-lists.module';
import { AlertsModule } from './alerts/alerts.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PortfolioModule, StocksModule, WatchListsModule, AlertsModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

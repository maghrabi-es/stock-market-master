import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PortfolioEntity } from './portfolio.entity';
import StockTransactionEntity from './stock-transaction.entity';
import WatchlistEntity from './watchlist.entity';

@Entity({
  name: 'stocks',
})
export default class StockEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column({ type: 'double', default: 0 })
  marketPrice: number;

  @Column({ default: 0 })
  numberOfShares: number;

  @Column({ type: 'double', default: 0 })
  costBasis: number;

  @Column({ type: 'double', default: 0 })
  marketValue: number;

  @Column({ type: 'double', default: 0 })
  marketWeight: number;

  @Column({ type: 'double', default: 0 })
  costPerShare: number;

  @Column({ type: 'double', default: 0 })
  unrealizedGainOrLoss: number;

  @Column({ type: 'double', default: 0 })
  unrealizedGainOrLossPercentage: number;

  @Column({ type: 'double', default: 0 })
  realizedGainOrLoss: number;

  @Column({ type: 'double', default: 0 })
  realizedGainOrLossPercentage: number;

  @Column({ type: 'double', default: 0 })
  dividends: number;

  @Column({ type: 'double', default: 0 })
  totalGainOrLoss: number;

  @Column({ type: 'double', default: 0 })
  dividendsPercentage: number;

  @ManyToOne(
    () => PortfolioEntity,
    portfolio => portfolio.stocks,
    {
      onDelete: 'CASCADE',
    },
  )
  portfolio: PortfolioEntity;

  @OneToMany(
    () => StockTransactionEntity,
    stockTransaction => stockTransaction.stock,
  )
  transactions: StockTransactionEntity[];

  @ManyToOne(
    () => WatchlistEntity,
    watchlist => watchlist.stocks,
    {
      nullable: true,
    },
  )
  watchList: WatchlistEntity;
}

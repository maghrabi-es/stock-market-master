import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import StockEntity from './stock.entity';
import { PortfolioEntity } from './portfolio.entity';
import AlertEntity from './alert.entity';

@Entity({
  name: 'watchlist',
})
export default class WatchlistEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null, nullable: true })
  maxAlertStockPrice: number;

  @OneToMany(
    () => StockEntity,
    stock => stock.watchList,
  )
  stocks: Array<StockEntity>;

  @ManyToOne(
    () => PortfolioEntity,
    portfolio => portfolio.watchLists,
    {
      onDelete: 'CASCADE',
    },
  )
  portfolio: PortfolioEntity;

  @OneToMany(
    () => AlertEntity,
    alert => alert.watchList,
  )
  alerts: AlertEntity[];
}

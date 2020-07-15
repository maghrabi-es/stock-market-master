import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import StockEntity from './stock.entity';
import WatchlistEntity from './watchlist.entity';

@Entity({
  name: 'portfolios',
})
export class PortfolioEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'double', default: 0 })
  marketValue: number;

  @OneToMany(
    () => StockEntity,
    stock => stock.portfolio,
  )
  stocks: StockEntity[];

  @OneToMany(
    () => WatchlistEntity,
    watchList => watchList.portfolio,
  )
  watchLists: WatchlistEntity[];
}

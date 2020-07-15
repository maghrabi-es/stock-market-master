import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import WatchlistEntity from './watchlist.entity';

@Entity({
  name: 'alerts',
})
export default class AlertEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alertId: string;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(
    () => WatchlistEntity,
    watchList => watchList.alerts,
    {
      onDelete: 'CASCADE',
    },
  )
  watchList: WatchlistEntity;
}

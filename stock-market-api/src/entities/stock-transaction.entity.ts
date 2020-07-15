import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import StockEntity from './stock.entity';

export enum TransactionTypes {
  BUY = 'Buy',
  SELL = 'Sell',
  DIVIDEND = 'Dividend',
}

@Entity('stock_transactions')
export default class StockTransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({
    enum: TransactionTypes,
    type: 'enum',
  })
  transactionType: string;

  @Column()
  numberOfShares: number;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'double' })
  fees: number;

  @ManyToOne(
    () => StockEntity,
    stock => stock.transactions,
    {
      onDelete: 'CASCADE',
    },
  )
  stock: StockEntity;
}

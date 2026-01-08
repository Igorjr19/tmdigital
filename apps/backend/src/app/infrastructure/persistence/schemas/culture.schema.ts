import { Column, Entity } from 'typeorm';
import { BaseSchema } from './base.schema';

@Entity('cultures')
export class CultureSchema extends BaseSchema {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'current_price', type: 'decimal', precision: 10, scale: 2 })
  currentPrice: number;
}

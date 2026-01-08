import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../../../../../shared/infrastructure/persistence/base.schema';
import { LeadStatus } from '../../../domain/entities/lead.entity';

@Entity('leads')
export class LeadSchema extends BaseSchema {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 14,
    unique: true,
  })
  document: string;

  @Column({
    name: 'current_supplier',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  currentSupplier?: string;

  @Column({
    enumName: 'leads_status_enum',
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({
    name: 'estimated_potential_revenue',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  estimatedPotentialRevenue: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;
}

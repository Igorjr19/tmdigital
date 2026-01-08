import { Column, Entity, OneToMany } from 'typeorm';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { BaseSchema } from './base.schema';
import type { RuralPropertySchema } from './rural-property.schema';

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
    name: 'estimated_potential',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  estimatedPotential: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @OneToMany('RuralPropertySchema', 'lead', {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  properties: RuralPropertySchema[];
}

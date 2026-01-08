import { Point } from 'geojson';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseSchema } from '../../../../../shared/infrastructure/persistence/base.schema';
import type { CropProductionSchema } from '../../../../culture/infrastructure/persistence/entities/crop-production.schema';
import { LeadSchema } from '../../../../lead/infrastructure/persistence/entities/lead.schema';

@Entity('rural_properties')
export class RuralPropertySchema extends BaseSchema {
  @Column({ name: 'lead_id', type: 'uuid' })
  leadId: string;

  @ManyToOne(() => LeadSchema)
  @JoinColumn({ name: 'lead_id' })
  lead: LeadSchema;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'total_area_hectares', type: 'float' })
  totalAreaHectares: number;

  @Column({ name: 'productive_area_hectares', type: 'float' })
  productiveAreaHectares: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 2 })
  state: string;

  @OneToMany('CropProductionSchema', 'ruralProperty')
  cropProductions: CropProductionSchema[];
}

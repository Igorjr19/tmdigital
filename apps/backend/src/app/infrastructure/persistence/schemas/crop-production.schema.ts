import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchema } from './base.schema';
import { CultureSchema } from './culture.schema';
import type { RuralPropertySchema } from './rural-property.schema';

@Entity('crop_productions')
export class CropProductionSchema extends BaseSchema {
  @Column({ name: 'rural_property_id', type: 'uuid' })
  ruralPropertyId: string;

  @ManyToOne('RuralPropertySchema', 'cropProductions')
  @JoinColumn({ name: 'rural_property_id' })
  ruralProperty: RuralPropertySchema;

  @Column({ name: 'culture_id', type: 'uuid' })
  cultureId: string;

  @ManyToOne(() => CultureSchema)
  @JoinColumn({ name: 'culture_id' })
  culture: CultureSchema;

  @Column({ name: 'planted_area', type: 'float' })
  plantedAreaHectares: number;
}

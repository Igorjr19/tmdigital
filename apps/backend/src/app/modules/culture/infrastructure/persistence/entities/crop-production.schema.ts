import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchema } from '../../../../../shared/infrastructure/persistence/base.schema';
import type { RuralPropertySchema } from '../../../../rural-property/infrastructure/persistence/entities/rural-property.schema';
import { CultureSchema } from './culture.schema';

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

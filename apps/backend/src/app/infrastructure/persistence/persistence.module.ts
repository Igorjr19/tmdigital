import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureRepository } from '../../domain/repositories/culture.repository';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { dataSourceOptions } from './postgres-datasource.config';
import { TypeOrmCultureRepository } from './repositories/typeorm-culture.repository';
import { TypeOrmLeadRepository } from './repositories/typeorm-lead.repository';
import { TypeOrmRuralPropertyRepository } from './repositories/typeorm-rural-property.repository';
import { CropProductionSchema } from './schemas/crop-production.schema';
import { CultureSchema } from './schemas/culture.schema';
import { LeadSchema } from './schemas/lead.schema';
import { RuralPropertySchema } from './schemas/rural-property.schema';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      LeadSchema,
      RuralPropertySchema,
      CultureSchema,
      CropProductionSchema,
    ]),
  ],
  providers: [
    {
      provide: LeadRepository,
      useClass: TypeOrmLeadRepository,
    },
    {
      provide: RuralPropertyRepository,
      useClass: TypeOrmRuralPropertyRepository,
    },
    {
      provide: CultureRepository,
      useClass: TypeOrmCultureRepository,
    },
    {
      provide: CultureRepository,
      useClass: TypeOrmCultureRepository,
    },
  ],
  exports: [
    LeadRepository,
    RuralPropertyRepository,
    CultureRepository,
    TypeOrmModule,
  ],
})
export class PersistenceModule {}

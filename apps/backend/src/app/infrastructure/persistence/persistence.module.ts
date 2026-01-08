import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { dataSourceOptions } from './postgres-datasource.config';
import { TypeOrmLeadRepository } from './repositories/typeorm-lead.repository';
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
  ],
  exports: [LeadRepository, TypeOrmModule],
})
export class PersistenceModule {}

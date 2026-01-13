import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersistenceModule } from '../persistence.module';
import { CropProductionSchema } from '../schemas/crop-production.schema';
import { CultureSchema } from '../schemas/culture.schema';
import { LeadSchema } from '../schemas/lead.schema';
import { RuralPropertySchema } from '../schemas/rural-property.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CultureSchema,
      LeadSchema,
      RuralPropertySchema,
      CropProductionSchema,
    ]),
    forwardRef(() => PersistenceModule),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

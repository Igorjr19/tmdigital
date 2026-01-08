import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropProductionSchema } from './infrastructure/persistence/entities/crop-production.schema';
import { CultureSchema } from './infrastructure/persistence/entities/culture.schema';

@Module({
  imports: [TypeOrmModule.forFeature([CultureSchema, CropProductionSchema])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class CultureModule {}

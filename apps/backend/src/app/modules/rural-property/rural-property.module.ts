import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuralPropertySchema } from './infrastructure/persistence/entities/rural-property.schema';

@Module({
  imports: [TypeOrmModule.forFeature([RuralPropertySchema])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class RuralPropertyModule {}

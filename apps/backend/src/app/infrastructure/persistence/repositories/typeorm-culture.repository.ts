import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Culture } from '../../../domain/entities/culture.entity';
import { CultureRepository } from '../../../domain/repositories/culture.repository';
import { CultureMapper } from '../mappers/culture.mapper';
import { CultureSchema } from '../schemas/culture.schema';

@Injectable()
export class TypeOrmCultureRepository implements CultureRepository {
  constructor(
    @InjectRepository(CultureSchema)
    private readonly repository: Repository<CultureSchema>,
  ) {}

  async save(culture: Culture): Promise<Culture> {
    const schema = CultureMapper.toPersistence(culture);
    const saved = await this.repository.save(schema);
    return CultureMapper.toDomain(saved);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findAll(): Promise<Culture[]> {
    const schemas = await this.repository.find();
    return schemas.map(CultureMapper.toDomain);
  }

  async findPlantingIn(months: number[]): Promise<Culture[]> {
    const schemas = await this.repository
      .createQueryBuilder('c')
      .where('c.planting_months && ARRAY[:...months]::int[]', { months })
      .getMany();
    return schemas.map(CultureMapper.toDomain);
  }
}

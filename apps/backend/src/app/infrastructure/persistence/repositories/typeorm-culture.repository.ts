import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Culture } from '../../../domain/entities/culture.entity';
import { CultureRepository } from '../../../domain/repositories/culture.repository';
import { HandleDbErrors } from '../decorators/handle-db-errors.decorator';
import { CultureMapper } from '../mappers/culture.mapper';
import { CultureSchema } from '../schemas/culture.schema';

@Injectable()
export class TypeOrmCultureRepository implements CultureRepository {
  constructor(
    @InjectRepository(CultureSchema)
    private readonly typeOrmRepository: Repository<CultureSchema>,
  ) {}

  @HandleDbErrors()
  async save(culture: Culture): Promise<Culture> {
    const schema = CultureMapper.toPersistence(culture);
    const savedSchema = await this.typeOrmRepository.save(schema);
    return CultureMapper.toDomain(savedSchema);
  }

  async count(): Promise<number> {
    return this.typeOrmRepository.count();
  }

  async find(): Promise<Culture[]> {
    const schemas = await this.typeOrmRepository.find();
    return schemas.map(CultureMapper.toDomain);
  }
}

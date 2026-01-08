import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { RuralPropertyRepository } from '../../../domain/repositories/rural-property.repository';
import { RuralPropertyMapper } from '../mappers/rural-property.mapper';
import { RuralPropertySchema } from '../schemas/rural-property.schema';

@Injectable()
export class TypeOrmRuralPropertyRepository implements RuralPropertyRepository {
  constructor(
    @InjectRepository(RuralPropertySchema)
    private readonly typeOrmRepository: Repository<RuralPropertySchema>,
  ) {}

  async save(ruralProperty: RuralProperty): Promise<RuralProperty> {
    const schema = RuralPropertyMapper.toPersistence(ruralProperty);
    const savedSchema = await this.typeOrmRepository.save(schema);
    return RuralPropertyMapper.toDomain(savedSchema);
  }

  async findById(id: string): Promise<RuralProperty | null> {
    const schema = await this.typeOrmRepository.findOne({ where: { id } });
    if (!schema) return null;
    return RuralPropertyMapper.toDomain(schema);
  }

  async update(ruralProperty: RuralProperty): Promise<RuralProperty> {
    return this.save(ruralProperty);
  }

  async delete(id: string): Promise<void> {
    const schema = await this.typeOrmRepository.findOne({ where: { id } });
    if (schema) {
      await this.typeOrmRepository.softRemove(schema);
    }
  }
}

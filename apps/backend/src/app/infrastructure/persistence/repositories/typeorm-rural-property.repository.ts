import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { RuralPropertyRepository } from '../../../domain/repositories/rural-property.repository';
import { HandleDbErrors } from '../decorators/handle-db-errors.decorator';
import { RuralPropertyMapper } from '../mappers/rural-property.mapper';
import { CropProductionSchema } from '../schemas/crop-production.schema';
import { RuralPropertySchema } from '../schemas/rural-property.schema';

@Injectable()
export class TypeOrmRuralPropertyRepository implements RuralPropertyRepository {
  constructor(
    @InjectRepository(RuralPropertySchema)
    private readonly typeOrmRepository: Repository<RuralPropertySchema>,
  ) {}

  @HandleDbErrors()
  async save(ruralProperty: RuralProperty): Promise<RuralProperty> {
    const schema = RuralPropertyMapper.toPersistence(ruralProperty);
    const savedSchema = await this.typeOrmRepository.save(schema);

    if (schema.cropProductions && schema.cropProductions.length > 0) {
      const children = schema.cropProductions.map((cp) => {
        cp.ruralProperty = savedSchema;
        cp.ruralPropertyId = savedSchema.id;
        return cp;
      });
      await this.typeOrmRepository.manager.save(CropProductionSchema, children);
    }

    return RuralPropertyMapper.toDomain(savedSchema);
  }

  async findAllByLeadId(leadId: string): Promise<RuralProperty[]> {
    const schemas = await this.typeOrmRepository.find({
      where: { lead: { id: leadId } },
      relations: ['cropProductions', 'cropProductions.culture', 'lead'],
      order: { createdAt: 'DESC' },
    });
    return schemas.map(RuralPropertyMapper.toDomain);
  }

  async deleteCropProductions(ruralPropertyId: string): Promise<void> {
    await this.typeOrmRepository.manager.delete(CropProductionSchema, {
      ruralPropertyId,
    });
  }

  async findById(id: string): Promise<RuralProperty | null> {
    const schema = await this.typeOrmRepository.findOne({ where: { id } });
    if (!schema) return null;
    return RuralPropertyMapper.toDomain(schema);
  }

  async findByIdWithRelations(id: string): Promise<RuralProperty | null> {
    const schema = await this.typeOrmRepository.findOne({
      where: { id },
      relations: ['cropProductions', 'cropProductions.culture'],
    });
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

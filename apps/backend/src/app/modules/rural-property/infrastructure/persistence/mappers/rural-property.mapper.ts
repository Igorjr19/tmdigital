import { CropProductionMapper } from '../../../../culture/infrastructure/persistence/mappers/crop-production.mapper';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { RuralPropertySchema } from '../entities/rural-property.schema';

export class RuralPropertyMapper {
  static toDomain(schema: RuralPropertySchema): RuralProperty {
    return RuralProperty.create({
      id: schema.id,
      leadId: schema.leadId,
      name: schema.name,
      totalAreaHectares: schema.totalAreaHectares,
      productiveAreaHectares: schema.productiveAreaHectares,
      location: schema.location,
      city: schema.city,
      state: schema.state,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      cropProductions: schema.cropProductions
        ? schema.cropProductions.map(CropProductionMapper.toDomain)
        : [],
    });
  }

  static toPersistence(domain: RuralProperty): RuralPropertySchema {
    const schema = new RuralPropertySchema();
    schema.id = domain.id;
    schema.leadId = domain.leadId;
    schema.name = domain.name;
    schema.totalAreaHectares = domain.totalAreaHectares;
    schema.productiveAreaHectares = domain.productiveAreaHectares;
    schema.location = domain.location;
    schema.city = domain.city;
    schema.state = domain.state;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}

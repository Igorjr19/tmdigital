import { CropProduction } from '../../../domain/entities/crop-production.entity';
import { CropProductionSchema } from '../entities/crop-production.schema';
import { CultureMapper } from './culture.mapper';

export class CropProductionMapper {
  static toDomain(schema: CropProductionSchema): CropProduction {
    return CropProduction.create({
      id: schema.id,
      ruralPropertyId: schema.ruralPropertyId,
      cultureId: schema.cultureId,
      plantedAreaHectares: schema.plantedAreaHectares,
      culture: schema.culture
        ? CultureMapper.toDomain(schema.culture)
        : undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(domain: CropProduction): CropProductionSchema {
    const schema = new CropProductionSchema();
    schema.id = domain.id;
    schema.ruralPropertyId = domain.ruralPropertyId;
    schema.cultureId = domain.cultureId;
    schema.plantedAreaHectares = domain.plantedAreaHectares;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}

import { Culture } from '../../../domain/entities/culture.entity';
import { CultureSchema } from '../entities/culture.schema';

export class CultureMapper {
  static toDomain(schema: CultureSchema): Culture {
    return Culture.create({
      id: schema.id,
      name: schema.name,
      currentPrice: Number(schema.currentPrice),
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(domain: Culture): CultureSchema {
    const schema = new CultureSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.currentPrice = domain.currentPrice;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}

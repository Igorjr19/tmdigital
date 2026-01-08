import { RuralPropertyMapper } from '../../../../rural-property/infrastructure/persistence/mappers/rural-property.mapper';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadSchema } from '../entities/lead.schema';

export class LeadMapper {
  static toDomain(schema: LeadSchema): Lead {
    return Lead.create({
      id: schema.id,
      name: schema.name,
      document: schema.document,
      currentSupplier: schema.currentSupplier,
      status: schema.status,
      estimatedPotential: Number(schema.estimatedPotential),
      notes: schema.notes,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      properties: schema.properties
        ? schema.properties.map(RuralPropertyMapper.toDomain)
        : [],
    });
  }

  static toPersistence(domain: Lead): LeadSchema {
    const schema = new LeadSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.document = domain.document;
    schema.currentSupplier = domain.currentSupplier;
    schema.status = domain.status;
    schema.estimatedPotential = domain.estimatedPotential;
    schema.notes = domain.notes;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}

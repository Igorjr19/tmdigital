import { Lead } from '../../../domain/entities/lead.entity';
import { LeadSchema } from '../schemas/lead.schema';
import { RuralPropertyMapper } from './rural-property.mapper';

export class LeadMapper {
  static toDomain(schema: LeadSchema): Lead {
    return Lead.create({
      id: schema.id,
      name: schema.name,
      document: schema.document,
      phone: schema.phone,
      currentSupplier: schema.currentSupplier,
      status: schema.status,
      estimatedPotential: Number(schema.estimatedPotential),
      notes: schema.notes,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: schema.deletedAt ?? undefined,
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
    schema.phone = domain.phone;
    schema.currentSupplier = domain.currentSupplier;
    schema.status = domain.status;
    schema.estimatedPotential = domain.estimatedPotential;
    schema.notes = domain.notes;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    schema.deletedAt = domain.deletedAt ?? null;
    schema.properties = domain.properties
      ? domain.properties.map(RuralPropertyMapper.toPersistence)
      : [];
    return schema;
  }
}

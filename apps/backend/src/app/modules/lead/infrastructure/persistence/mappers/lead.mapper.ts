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
      // Ensure number conversion if decimal comes as string
      estimatedPotentialRevenue: Number(schema.estimatedPotentialRevenue),
      notes: schema.notes,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(domain: Lead): LeadSchema {
    const schema = new LeadSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.document = domain.document;
    schema.currentSupplier = domain.currentSupplier;
    schema.status = domain.status;
    schema.estimatedPotentialRevenue = domain.estimatedPotentialRevenue;
    schema.notes = domain.notes;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}

import { Lead, LeadStatus } from '../../domain/entities/lead.entity';

export class LeadDto {
  id: string;
  name: string;
  document: string;
  currentSupplier?: string;
  status: LeadStatus;
  estimatedPotentialRevenue: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(lead: Lead): LeadDto {
    const dto = new LeadDto();
    dto.id = lead.id;
    dto.name = lead.name;
    dto.document = lead.document;
    dto.currentSupplier = lead.currentSupplier;
    dto.status = lead.status;
    dto.estimatedPotentialRevenue = lead.estimatedPotentialRevenue;
    dto.notes = lead.notes;
    dto.createdAt = lead.createdAt;
    dto.updatedAt = lead.updatedAt;
    return dto;
  }
}

import { LeadStatus } from '../../domain/entities/lead.entity';

export class CreateLeadDto {
  name: string;
  document: string;
  currentSupplier?: string;
  status?: LeadStatus;
  estimatedPotentialRevenue: number;
  notes?: string;
}

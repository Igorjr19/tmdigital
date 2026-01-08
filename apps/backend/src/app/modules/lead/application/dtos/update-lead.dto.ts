import { LeadStatus } from '../../domain/entities/lead.entity';

export class UpdateLeadDto {
  name?: string;
  currentSupplier?: string;
  status?: LeadStatus;
  estimatedPotentialRevenue?: number;
  notes?: string;
}

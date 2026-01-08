import { Lead } from '../entities/lead.entity';

export abstract class LeadRepository {
  abstract save(lead: Lead): Promise<Lead>;
  abstract findById(id: string): Promise<Lead | null>;
  abstract findByDocument(document: string): Promise<Lead | null>;
  abstract findAll(): Promise<Lead[]>;
  abstract update(lead: Lead): Promise<Lead>;
  abstract delete(id: string): Promise<void>;
}

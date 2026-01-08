import { PaginationDto } from '../../../../shared/application/dtos/pagination.dto';
import { Lead } from '../entities/lead.entity';

export abstract class ILeadRepository {
  abstract save(lead: Lead): Promise<Lead>;
  abstract findById(id: string): Promise<Lead | null>;
  abstract findByDocument(document: string): Promise<Lead | null>;
  abstract findAll(params?: PaginationDto): Promise<Lead[]>;
  abstract update(lead: Lead): Promise<Lead>;
  abstract delete(id: string): Promise<void>;
}

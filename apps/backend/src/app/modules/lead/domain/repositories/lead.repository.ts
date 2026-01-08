import { PaginationDto } from '../../../../shared/application/dtos/pagination.dto';
import { Lead } from '../entities/lead.entity';

export abstract class LeadRepository {
  abstract save(lead: Lead): Promise<Lead>;
  abstract findById(id: string): Promise<Lead | null>;
  abstract findByIdWithRelations(id: string): Promise<Lead | null>;
  abstract findByDocument(document: string): Promise<Lead | null>;
  abstract findNearby(
    lat: number,
    long: number,
    rangeKm: number,
    params?: PaginationDto,
  ): Promise<{ items: Lead[]; total: number }>;
  abstract findAll(
    params?: PaginationDto,
  ): Promise<{ items: Lead[]; total: number }>;
  abstract update(lead: Lead): Promise<Lead>;
  abstract delete(id: string): Promise<void>;
}

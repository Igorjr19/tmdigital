import { PaginationDto } from '../../application/dtos/pagination.dto';
import { ItemCount } from '../../application/interfaces/item-count.interface';
import { Lead } from '../entities/lead.entity';

export abstract class LeadRepository {
  abstract save(lead: Lead): Promise<Lead>;
  abstract findById(id: string): Promise<Lead | null>;
  abstract findByIdWithRelations(id: string): Promise<Lead | null>;
  abstract findByDocument(document: string): Promise<Lead | null>;
  abstract findIncludingDeletedByDocument(
    document: string,
  ): Promise<Lead | null>;
  abstract findNearby(
    lat: number,
    long: number,
    rangeKm: number,
    params?: PaginationDto,
  ): Promise<ItemCount<Lead>>;
  abstract findAll(params?: PaginationDto): Promise<ItemCount<Lead>>;
  abstract update(lead: Lead): Promise<Lead>;
  abstract delete(id: string): Promise<void>;
}

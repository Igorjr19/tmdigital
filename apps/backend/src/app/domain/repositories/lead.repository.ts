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
    range: number,
    pagination: PaginationDto,
  ): Promise<ItemCount<Lead>>;

  abstract findStale(daysSinceUpdate: number): Promise<Lead[]>;

  abstract getMarketShare(): Promise<
    { supplier: string; count: number; percentage: number }[]
  >;

  abstract getGeoStats(): Promise<{
    totalArea: number;
    convertedArea: number;
    heatmap: { lat: number; lng: number; weight: number }[];
  }>;

  abstract getForecast(): Promise<{
    totalPotential: number;
    weightedForecast: number;
  }>;

  abstract findAll(params?: PaginationDto): Promise<ItemCount<Lead>>;
  abstract update(lead: Lead): Promise<Lead>;
  abstract delete(id: string): Promise<void>;
}

import { LeadDto, RuralPropertyDto } from '../../../api/model/models';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface RuralPropertyWithLocation extends Omit<
  RuralPropertyDto,
  'location'
> {
  location: GeoPoint;
}

export interface LeadWithProperties extends LeadDto {
  properties: RuralPropertyWithLocation[];
}

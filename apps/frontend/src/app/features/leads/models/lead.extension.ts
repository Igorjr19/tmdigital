import { LeadDto, PointDto, RuralPropertyDto } from '../../../api/model/models';

export interface RuralPropertyWithLocation extends Omit<
  RuralPropertyDto,
  'location'
> {
  location: PointDto;
}

export interface LeadWithProperties extends LeadDto {
  properties: RuralPropertyWithLocation[];
}

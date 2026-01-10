import { LeadDto, RuralPropertyDto } from '../../../api/model/models';

export interface LeadWithProperties extends LeadDto {
  properties: RuralPropertyDto[];
}

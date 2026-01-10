import { UpdateRuralPropertyDto } from '../dtos/update-rural-property.dto';

export class UpdateRuralPropertyInput {
  id: string;
  leadId: string;
  data: UpdateRuralPropertyDto;
}

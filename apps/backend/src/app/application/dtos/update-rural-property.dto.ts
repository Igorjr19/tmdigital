import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRuralPropertyDto } from './create-rural-property.dto';

export class UpdateRuralPropertyDto extends PartialType(
  CreateRuralPropertyDto,
) {
  @ApiPropertyOptional()
  leadId?: string;
}

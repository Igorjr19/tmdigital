import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRuralPropertyDto } from './create-rural-property.dto';

export class UpdateRuralPropertyDto extends PartialType(
  CreateRuralPropertyDto,
) {
  @ApiPropertyOptional({
    description: 'ID do novo Lead proprietário (transferência de propriedade)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  leadId?: string;
}

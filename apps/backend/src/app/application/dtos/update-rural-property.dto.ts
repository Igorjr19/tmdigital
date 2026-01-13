import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateRuralPropertyDto } from './create-rural-property.dto';
import { CropProductionInputDto } from './crop-production-input.dto';

export class UpdateRuralPropertyDto extends PartialType(
  CreateRuralPropertyDto,
) {
  @ApiPropertyOptional({
    description: 'ID do novo Lead proprietário (transferência de propriedade)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  leadId?: string;

  @ApiPropertyOptional({
    description: 'Lista de plantações para atualizar (substitui a lista atual)',
    type: [CropProductionInputDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CropProductionInputDto)
  cropProductions?: CropProductionInputDto[];
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LeadStatus } from '../../domain/enums/lead-status.enum';

export class UpdateLeadDto {
  @ApiPropertyOptional({
    description: 'Nome do lead',
    example: 'João Silva Santos',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Fornecedor atual',
    example: 'Fornecedor B',
  })
  @IsString()
  @IsOptional()
  currentSupplier?: string;

  @ApiPropertyOptional({
    description: 'Status do lead',
    enum: LeadStatus,
    example: LeadStatus.QUALIFIED,
  })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Receita potencial estimada',
    example: 75000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  estimatedPotential?: number;

  @ApiPropertyOptional({
    description: 'Notas adicionais',
    example: 'Lead confirmado na última reunião',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

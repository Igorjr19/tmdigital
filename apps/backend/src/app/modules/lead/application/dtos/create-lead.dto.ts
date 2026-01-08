import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LeadStatus } from '../../domain/enums/lead-status.enum';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Nome do lead',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do lead',
    example: '12345678901234',
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiPropertyOptional({
    description: 'Fornecedor atual',
    example: 'Fornecedor A',
  })
  @IsString()
  @IsOptional()
  currentSupplier?: string;

  @ApiPropertyOptional({
    description: 'Status do lead',
    enum: LeadStatus,
    example: LeadStatus.NEW,
  })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiProperty({
    description: 'Receita potencial estimada',
    example: 50000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  estimatedPotential: number;

  @ApiPropertyOptional({
    description: 'Notas adicionais',
    example: 'Interessado em produtos de qualidade',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

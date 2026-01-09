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
    description: 'Nome completo do lead',
    example: 'João da Silva',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do lead (apenas números ou formatado)',
    example: '12345678901',
    minLength: 11,
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiPropertyOptional({
    description: 'Nome do fornecedor atual (se houver)',
    example: 'AgroSul Fornecedora',
  })
  @IsString()
  @IsOptional()
  currentSupplier?: string;

  @ApiPropertyOptional({
    description: 'Status inicial do lead no funil de vendas',
    enum: LeadStatus,
    example: LeadStatus.NEW,
    default: LeadStatus.NEW,
  })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiProperty({
    description: 'Receita potencial estimada em reais (R$)',
    example: 50000.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  estimatedPotential: number;

  @ApiPropertyOptional({
    description: 'Observações ou notas adicionais sobre o lead',
    example: 'Interessado na linha premium de fertilizantes para soja',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

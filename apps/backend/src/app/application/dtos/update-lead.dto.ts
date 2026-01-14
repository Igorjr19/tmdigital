import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { IsCpfOrCnpj } from '../decorators/is-cpf-or-cnpj.decorator';

export class UpdateLeadDto {
  @ApiPropertyOptional({
    description: 'Nome completo do lead',
    example: 'João Silva Santos',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'CPF ou CNPJ do Lead',
    example: '123.456.789-00',
  })
  @IsOptional()
  @IsString()
  @IsCpfOrCnpj({ message: 'Documento inválido (CPF ou CNPJ)' })
  document?: string;

  @ApiPropertyOptional({
    description: 'Fornecedor atual do lead',
    example: 'Terra Fértil Insumos',
  })
  @IsString()
  @IsOptional()
  currentSupplier?: string;

  @ApiPropertyOptional({
    description: 'Novo status do lead no funil',
    enum: LeadStatus,
    example: LeadStatus.QUALIFIED,
  })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({
    description: 'Receita potencial estimada em reais (R$)',
    example: 75000.5,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  estimatedPotential?: number;

  @ApiPropertyOptional({
    description: 'Observações ou notas adicionais',
    example: 'Cliente solicitou visita técnica para próxima semana',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

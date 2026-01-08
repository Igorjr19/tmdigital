import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadStatus } from '../../domain/enums/lead-status.enum';

export class LeadDto {
  @ApiProperty({
    description: 'ID único do lead',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do lead',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do lead',
    example: '12345678901234',
  })
  document: string;

  @ApiPropertyOptional({
    description: 'Fornecedor atual',
    example: 'Fornecedor A',
  })
  currentSupplier?: string;

  @ApiProperty({
    description: 'Status do lead',
    enum: LeadStatus,
    example: LeadStatus.NEW,
  })
  status: LeadStatus;

  @ApiProperty({
    description: 'Receita potencial estimada',
    example: 50000,
    type: Number,
  })
  estimatedPotential: number;

  @ApiPropertyOptional({
    description: 'Notas adicionais',
    example: 'Interessado em produtos de qualidade',
  })
  notes?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2026-01-08T13:34:57.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2026-01-08T13:34:57.000Z',
    type: Date,
  })
  updatedAt: Date;

  static fromDomain(lead: Lead): LeadDto {
    const dto = new LeadDto();
    dto.id = lead.id;
    dto.name = lead.name;
    dto.document = lead.document;
    dto.currentSupplier = lead.currentSupplier;
    dto.status = lead.status;
    dto.estimatedPotential = lead.estimatedPotential;
    dto.notes = lead.notes;
    dto.createdAt = lead.createdAt;
    dto.updatedAt = lead.updatedAt;
    return dto;
  }
}

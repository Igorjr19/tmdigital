import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { RuralPropertyDto } from './rural-property.dto';

export class LeadDto {
  @ApiProperty({
    description: 'Identificador único do lead (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do lead',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do lead',
    example: '123.456.789-00',
  })
  document: string;

  @ApiPropertyOptional({
    description: 'Fornecedor atual (opcional)',
    example: 'Cooperativa Regional',
    nullable: true,
  })
  currentSupplier?: string;

  @ApiProperty({
    description: 'Status atual no funil de vendas',
    enum: LeadStatus,
    example: LeadStatus.NEW,
  })
  status: LeadStatus;

  @ApiProperty({
    description: 'Potencial de receita estimado (R$)',
    example: 50000.0,
    type: Number,
  })
  estimatedPotential: number;

  @ApiPropertyOptional({
    description: 'Notas e observações',
    example: 'Cliente possui restrição no Serasa',
    nullable: true,
  })
  notes?: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2026-01-08T13:34:57.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2026-01-08T15:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Lista de propriedades rurais',
    type: () => [RuralPropertyDto],
  })
  properties?: RuralPropertyDto[];

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
    if (lead.properties) {
      dto.properties = lead.properties.map(RuralPropertyDto.fromDomain);
    }
    return dto;
  }
}

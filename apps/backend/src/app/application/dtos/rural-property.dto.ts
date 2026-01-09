import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';
import { RuralProperty } from '../../domain/entities/rural-property.entity';

export class RuralPropertyDto {
  @ApiProperty({
    description: 'Identificador único da propriedade (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID do Lead proprietário',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  leadId: string;

  @ApiProperty({
    description: 'Nome da propriedade rural',
    example: 'Fazenda Santa Maria',
  })
  name: string;

  @ApiProperty({
    description: 'Área total em hectares',
    example: 1000.5,
    type: Number,
  })
  totalAreaHectares: number;

  @ApiProperty({
    description: 'Área produtiva em hectares',
    example: 800.0,
    type: Number,
  })
  productiveAreaHectares: number;

  @ApiProperty({
    description: 'Localização geográfica (GeoJSON Point)',
    example: { type: 'Point', coordinates: [-52.123, -23.456] },
  })
  location: Point;

  @ApiProperty({
    description: 'Cidade da propriedade',
    example: 'Maringá',
  })
  city: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'PR',
  })
  state: string;

  @ApiProperty({
    description: 'Data de registro da propriedade',
    example: '2026-01-08T13:34:57.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última alteração',
    example: '2026-01-08T15:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  static fromDomain(entity: RuralProperty): RuralPropertyDto {
    const dto = new RuralPropertyDto();
    dto.id = entity.id;
    dto.leadId = entity.leadId;
    dto.name = entity.name;
    dto.totalAreaHectares = entity.totalAreaHectares;
    dto.productiveAreaHectares = entity.productiveAreaHectares;
    dto.location = entity.location;
    dto.city = entity.city;
    dto.state = entity.state;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

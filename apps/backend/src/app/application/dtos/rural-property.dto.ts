import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';
import { RuralProperty } from '../../domain/entities/rural-property.entity';

export class RuralPropertyDto {
  @ApiProperty({ description: 'ID da propriedade' })
  id: string;

  @ApiProperty({ description: 'ID do Lead proprietário' })
  leadId: string;

  @ApiProperty({ description: 'Nome da propriedade' })
  name: string;

  @ApiProperty({ description: 'Área total em hectares' })
  totalAreaHectares: number;

  @ApiProperty({ description: 'Área produtiva em hectares' })
  productiveAreaHectares: number;

  @ApiProperty({ description: 'Localização geográfica' })
  location: Point;

  @ApiProperty({ description: 'Cidade' })
  city: string;

  @ApiProperty({ description: 'Estado (UF)' })
  state: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
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

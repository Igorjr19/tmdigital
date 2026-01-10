import { ApiProperty } from '@nestjs/swagger';
import { CropProduction } from '../../domain/entities/crop-production.entity';
import { CultureDto } from './culture.dto';

export class CropProductionDto {
  @ApiProperty({
    description: 'ID da plantação',
    example: 'uuid-v4',
  })
  id: string;

  @ApiProperty({
    description: 'ID da cultura vinculada',
    example: 'uuid-v4',
  })
  cultureId: string;

  @ApiProperty({
    description: 'Área plantada em hectares',
    example: 50.5,
  })
  plantedAreaHectares: number;

  @ApiProperty({
    description: 'Dados da cultura (se carregados)',
    type: CultureDto,
    required: false,
  })
  culture?: CultureDto;

  static fromDomain(entity: CropProduction): CropProductionDto {
    const dto = new CropProductionDto();
    dto.id = entity.id;
    dto.cultureId = entity.cultureId;
    dto.plantedAreaHectares = entity.plantedAreaHectares;
    if (entity.culture) {
      dto.culture = CultureDto.fromDomain(entity.culture);
    }
    return dto;
  }
}

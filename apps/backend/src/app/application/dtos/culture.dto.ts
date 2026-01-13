import { ApiProperty } from '@nestjs/swagger';
import { Culture } from '../../domain/entities/culture.entity';

export class CultureDto {
  @ApiProperty({
    description: 'ID da cultura',
    example: 'uuid-v4',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soja',
  })
  name: string;

  @ApiProperty({
    description: 'Preço atual da saca/unidade',
    example: 150.5,
  })
  @ApiProperty({
    description: 'Preço atual da saca/unidade',
    example: 150.5,
  })
  currentPrice: number;

  @ApiProperty({
    description: 'Meses de plantio (1-12)',
    example: [10, 11, 12],
    type: [Number],
  })
  plantingMonths: number[];

  static fromDomain(entity: Culture): CultureDto {
    const dto = new CultureDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.currentPrice = entity.currentPrice;
    dto.plantingMonths = entity.plantingMonths;
    return dto;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Point } from 'geojson';

export class CreateRuralPropertyDto {
  @ApiProperty({ description: 'ID do Lead proprietário', example: 'uuid-here' })
  @IsUUID()
  @IsNotEmpty()
  leadId: string;

  @ApiProperty({
    description: 'Nome da propriedade',
    example: 'Fazenda Santa Maria',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Área total em hectares', example: 1000.5 })
  @IsNumber()
  @Min(0)
  totalAreaHectares: number;

  @ApiProperty({ description: 'Área produtiva em hectares', example: 800.0 })
  @IsNumber()
  @Min(0)
  productiveAreaHectares: number;

  @ApiProperty({
    description: 'Localização geográfica (GeoJSON Point)',
    example: { type: 'Point', coordinates: [-52.123, -23.456] },
  })
  @IsObject()
  @IsNotEmpty()
  location: Point;

  @ApiProperty({ description: 'Cidade', example: 'Maringá' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado (UF)', example: 'PR' })
  @IsString()
  @IsNotEmpty()
  state: string;
}

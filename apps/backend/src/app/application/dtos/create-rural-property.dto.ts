import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Point } from 'geojson';
import { CropProductionInputDto } from './crop-production-input.dto';

export class CreateRuralPropertyDto {
  @ApiProperty({
    description: 'ID do Lead proprietário associado',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  leadId: string;

  @ApiProperty({
    description: 'Nome da propriedade rural',
    example: 'Fazenda Santa Maria',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Área total da propriedade em hectares',
    example: 1000.5,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalAreaHectares: number;

  @ApiProperty({
    description: 'Área produtiva da propriedade em hectares',
    example: 800.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  productiveAreaHectares: number;

  @ApiProperty({
    description: 'Localização geográfica no formato GeoJSON Point',
    example: { type: 'Point', coordinates: [-52.123, -23.456] },
  })
  @IsObject()
  @IsNotEmpty()
  location: Point;

  @ApiProperty({
    description: 'Cidade onde a propriedade está localizada',
    example: 'Maringá',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Estado (UF) da propriedade',
    example: 'PR',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiPropertyOptional({
    description: 'Lista de plantações para atualizar (substitui a lista atual)',
    type: [CropProductionInputDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CropProductionInputDto)
  @MinLength(1)
  cropProductions: CropProductionInputDto[];
}

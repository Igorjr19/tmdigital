import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class GetNearbyLeadsDto extends PaginationDto {
  @ApiProperty({
    description: 'Latitude central para a busca (-90 a 90)',
    example: -23.420999,
    type: Number,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude central para a busca (-180 a 180)',
    example: -51.933056,
    type: Number,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  long: number;

  @ApiProperty({
    description: 'Raio de busca em metros',
    example: 10000,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  range: number;
}

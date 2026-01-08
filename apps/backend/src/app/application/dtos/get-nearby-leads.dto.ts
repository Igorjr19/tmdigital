import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class GetNearbyLeadsDto extends PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  long: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  range: number;
}

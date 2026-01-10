import { ApiProperty } from '@nestjs/swagger';
import { BBox, Point, Position } from 'geojson';

export class PointDto implements Point {
  @ApiProperty({
    description: 'BBox',
    example: [10, 20, 30, 40],
    type: [Number],
    minLength: 4,
    maxLength: 4,
  })
  bbox?: BBox;

  @ApiProperty({
    description: 'Coordinates',
    example: [10, 20],
    type: [Number],
    minLength: 2,
    maxLength: 2,
  })
  coordinates: Position;

  @ApiProperty({
    description: 'Type',
    example: 'Point',
    type: String,
  })
  type: 'Point';
}

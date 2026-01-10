import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CropProductionInputDto {
  @ApiProperty({
    description: 'ID da cultura vinculada',
    example: 'uuid-v4',
  })
  @IsUUID()
  @IsNotEmpty()
  cultureId: string;

  @ApiProperty({
    description: 'Área plantada em hectares',
    example: 50.5,
  })
  @IsNumber()
  @Min(0)
  plantedAreaHectares: number;
}

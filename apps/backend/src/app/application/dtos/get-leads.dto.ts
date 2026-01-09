import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { PaginationDto } from './pagination.dto';

export class GetLeadsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar leads pelo nome (busca parcial)',
    example: 'Silva',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar leads por status específico',
    enum: LeadStatus,
    example: LeadStatus.QUALIFIED,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
}

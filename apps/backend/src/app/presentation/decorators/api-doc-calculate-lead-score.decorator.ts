import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadScoreDto } from '../../application/dtos/lead-score.dto';

export function ApiDocCalculateLeadScore() {
  return applyDecorators(
    ApiOperation({ summary: 'Calcula o score de um lead' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Score calculado com sucesso',
      type: LeadScoreDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Lead não encontrado',
    }),
  );
}

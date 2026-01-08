import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadDto } from '../../application/dtos/lead.dto';

export function ApiDocFindOneLead() {
  return applyDecorators(
    ApiOperation({ summary: 'Busca um Lead por ID' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lead encontrado',
      type: LeadDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Lead não encontrado',
    }),
  );
}

import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadDto } from '../../application/dtos/lead.dto';

export function ApiDocUpdateLead() {
  return applyDecorators(
    ApiOperation({ summary: 'Atualiza dados de um Lead' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lead atualizado com sucesso',
      type: LeadDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Lead não encontrado',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Dados inválidos',
    }),
  );
}

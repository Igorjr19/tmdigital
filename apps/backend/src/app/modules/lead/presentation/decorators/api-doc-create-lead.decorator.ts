import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadDto } from '../../application/dtos/lead.dto';

export function ApiDocCreateLead() {
  return applyDecorators(
    ApiOperation({ summary: 'Cadastra um novo Lead' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Lead criado com sucesso',
      type: LeadDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Documento duplicado',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Dados inválidos',
    }),
  );
}

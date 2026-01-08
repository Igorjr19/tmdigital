import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadDto } from '../../application/dtos/lead.dto';

export function ApiDocFindAllLeads() {
  return applyDecorators(
    ApiOperation({ summary: 'Lista todos os Leads' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de leads retornada com sucesso',
      type: [LeadDto],
    }),
  );
}

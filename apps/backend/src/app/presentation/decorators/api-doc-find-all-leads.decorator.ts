import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetLeadsResponseDto } from '../../application/dtos/get-leads-response.dto';

export function ApiDocFindAllLeads() {
  return applyDecorators(
    ApiOperation({ summary: 'Lista todos os Leads' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de leads retornada com sucesso',
      type: GetLeadsResponseDto,
    }),
  );
}

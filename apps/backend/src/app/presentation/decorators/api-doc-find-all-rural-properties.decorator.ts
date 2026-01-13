import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';

export function ApiDocFindAllRuralProperties() {
  return applyDecorators(
    ApiOperation({ summary: 'Lista todas as propriedades rurais de um Lead' }),
    ApiParam({
      name: 'leadId',
      description: 'ID do Lead (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de propriedades retornada com sucesso',
      type: [RuralPropertyDto],
    }),
  );
}

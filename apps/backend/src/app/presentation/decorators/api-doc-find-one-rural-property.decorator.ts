import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';

export function ApiDocFindOneRuralProperty() {
  return applyDecorators(
    ApiOperation({ summary: 'Busca uma propriedade rural por ID' }),
    ApiParam({
      name: 'leadId',
      description: 'ID do Lead proprietário (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiParam({
      name: 'id',
      description: 'ID da propriedade (UUID)',
      example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Propriedade encontrada',
      type: RuralPropertyDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Propriedade não encontrada ou não pertence ao Lead',
    }),
  );
}

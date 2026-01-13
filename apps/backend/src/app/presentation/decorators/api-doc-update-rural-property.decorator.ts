import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';
import { UpdateRuralPropertyDto } from '../../application/dtos/update-rural-property.dto';

export function ApiDocUpdateRuralProperty() {
  return applyDecorators(
    ApiOperation({ summary: 'Atualiza uma propriedade rural' }),
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
    ApiBody({ type: UpdateRuralPropertyDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Propriedade atualizada com sucesso',
      type: RuralPropertyDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Propriedade não encontrada ou não pertence ao Lead',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Dados inválidos',
    }),
  );
}

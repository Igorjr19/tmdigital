import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateRuralPropertyDto } from '../../application/dtos/create-rural-property.dto';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';

export function ApiDocAddRuralProperty() {
  return applyDecorators(
    ApiOperation({ summary: 'Adiciona uma propriedade rural a um Lead' }),
    ApiParam({
      name: 'id',
      description: 'ID do Lead (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiBody({ type: CreateRuralPropertyDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Propriedade rural criada com sucesso',
      type: RuralPropertyDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Lead não encontrado',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Dados inválidos ou regra de negócio violada',
    }),
  );
}

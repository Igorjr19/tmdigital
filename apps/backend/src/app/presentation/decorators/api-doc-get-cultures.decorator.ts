import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CultureDto } from '../../application/dtos/culture.dto';

export function ApiDocGetCultures() {
  return applyDecorators(
    ApiOperation({ summary: 'Lista todas as culturas disponíveis' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de culturas retornada com sucesso',
      type: [CultureDto],
    }),
  );
}

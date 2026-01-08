import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDocDeleteLead() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove um Lead' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Lead removido com sucesso',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Lead não encontrado',
    }),
  );
}

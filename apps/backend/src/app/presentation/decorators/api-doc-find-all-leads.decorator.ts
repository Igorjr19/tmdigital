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
    // We don't need explicit ApiQuery decorators here because nested objects in @Query
    // are not fully supported by @nestjs/swagger for auto-generation without flatten.
    // However, since we use a DTO class with @Query, Swagger plugin usually picks it up.
    // Let's verify if we need to add explicit ApiQuery for clarity or if DTO annotations are enough.
    // Given the DTO is annotated, it should be fine.
  );
}

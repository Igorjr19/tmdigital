import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadata {
  @ApiProperty({ description: 'Total de itens encontrados', example: 100 })
  total: number;

  @ApiProperty({ description: 'Página atual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Itens por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de páginas', example: 10 })
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetadata })
  metadata: PaginationMetadata;
}

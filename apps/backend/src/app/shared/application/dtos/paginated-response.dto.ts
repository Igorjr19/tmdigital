import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadata {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetadata })
  metadata: PaginationMetadata;
}

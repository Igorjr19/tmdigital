import { ApiProperty } from '@nestjs/swagger';
import { LeadDto } from './lead.dto';
import { PaginatedResponseDto } from './paginated-response.dto';

export class GetLeadsResponseDto extends PaginatedResponseDto<LeadDto> {
  @ApiProperty({
    type: [LeadDto],
  })
  data: LeadDto[];
}

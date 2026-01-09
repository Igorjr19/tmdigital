import { PickType } from '@nestjs/swagger';
import { LeadDto } from './lead.dto';

export class LeadScoreDto extends PickType(LeadDto, [
  'id',
  'estimatedPotential',
  'updatedAt',
]) {}

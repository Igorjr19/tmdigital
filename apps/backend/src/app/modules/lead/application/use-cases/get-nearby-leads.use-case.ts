import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';

import { GetNearbyLeadsDto } from '../dtos/get-nearby-leads.dto';

@Injectable()
export class GetNearbyLeadsUseCase implements UseCase<
  GetNearbyLeadsDto,
  { items: Lead[]; total: number }
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(
    input: GetNearbyLeadsDto,
  ): Promise<{ items: Lead[]; total: number }> {
    return this.leadRepository.findNearby(
      input.lat,
      input.long,
      input.range,
      input,
    );
  }
}

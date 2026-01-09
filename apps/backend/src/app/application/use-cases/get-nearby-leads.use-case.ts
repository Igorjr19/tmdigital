import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

import { GetNearbyLeadsDto } from '../dtos/get-nearby-leads.dto';
import { ItemCount } from '../interfaces/item-count.interface';

@Injectable()
export class GetNearbyLeadsUseCase implements UseCase<
  GetNearbyLeadsDto,
  ItemCount<Lead>
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(input: GetNearbyLeadsDto): Promise<ItemCount<Lead>> {
    return this.leadRepository.findNearby(
      input.lat,
      input.long,
      input.range,
      input,
    );
  }
}

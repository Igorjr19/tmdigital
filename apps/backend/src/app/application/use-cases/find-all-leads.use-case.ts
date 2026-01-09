import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { GetLeadsDto } from '../dtos/get-leads.dto';
import { ItemCount } from '../interfaces/item-count.interface';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class FindAllLeadsUseCase implements UseCase<
  GetLeadsDto,
  ItemCount<Lead>
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(params?: GetLeadsDto): Promise<ItemCount<Lead>> {
    return this.leadRepository.findAll(params);
  }
}

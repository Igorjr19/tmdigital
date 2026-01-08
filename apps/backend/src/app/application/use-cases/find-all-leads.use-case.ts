import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { GetLeadsDto } from '../dtos/get-leads.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class FindAllLeadsUseCase implements UseCase<
  GetLeadsDto,
  { items: Lead[]; total: number }
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(
    params?: GetLeadsDto,
  ): Promise<{ items: Lead[]; total: number }> {
    return this.leadRepository.findAll(params);
  }
}

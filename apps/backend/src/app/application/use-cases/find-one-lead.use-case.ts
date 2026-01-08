import { Injectable, NotFoundException } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class FindOneLeadUseCase implements UseCase<string, Lead> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }
}

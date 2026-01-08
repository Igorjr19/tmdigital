import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';

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

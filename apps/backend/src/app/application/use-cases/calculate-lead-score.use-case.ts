import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class CalculateLeadScoreUseCase implements UseCase<string, number> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(leadId: string): Promise<number> {
    const lead = await this.leadRepository.findByIdWithRelations(leadId);

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    lead.calculatePotential();
    await this.leadRepository.save(lead);

    return lead.estimatedPotential;
  }
}

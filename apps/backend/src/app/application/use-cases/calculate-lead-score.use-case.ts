import { Injectable } from '@nestjs/common';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class CalculateLeadScoreUseCase implements UseCase<string, number> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(leadId: string): Promise<number> {
    const lead = await this.leadRepository.findByIdWithRelations(leadId);

    if (!lead) {
      throw new ResourceNotFoundException(
        `Lead with ID ${leadId} not found`,
        DomainErrorCodes.LEAD_NOT_FOUND,
      );
    }

    lead.calculatePotential();

    await this.leadRepository.save(lead);

    return lead.estimatedPotential;
  }
}

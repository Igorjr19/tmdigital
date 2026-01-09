import { Injectable } from '@nestjs/common';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { LeadScoreDto } from '../dtos/lead-score.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class CalculateLeadScoreUseCase implements UseCase<
  string,
  LeadScoreDto
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(leadId: string): Promise<LeadScoreDto> {
    const lead = await this.leadRepository.findByIdWithRelations(leadId);

    if (!lead) {
      throw new ResourceNotFoundException(
        `Lead with ID ${leadId} not found`,
        DomainErrorCodes.LEAD_NOT_FOUND,
      );
    }

    lead.calculatePotential();

    await this.leadRepository.save(lead);

    return {
      id: lead.id,
      estimatedPotential: lead.estimatedPotential,
      updatedAt: lead.updatedAt,
    };
  }
}

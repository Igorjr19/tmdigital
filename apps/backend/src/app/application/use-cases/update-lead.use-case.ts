import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UpdateLeadInput } from '../interfaces/update-lead-input';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class UpdateLeadUseCase implements UseCase<UpdateLeadInput, Lead> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(input: UpdateLeadInput): Promise<Lead> {
    const lead = await this.leadRepository.findById(input.id);
    if (!lead) {
      throw new ResourceNotFoundException(
        `Lead with ID ${input.id} not found`,
        DomainErrorCodes.LEAD_NOT_FOUND,
      );
    }

    lead.updateInformation(input.data);

    if (input.data.status) {
      lead.updateStatus(input.data.status);
    }

    return this.leadRepository.update(lead);
  }
}

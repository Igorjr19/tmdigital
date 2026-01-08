import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UpdateLeadInput } from '../dtos/update-lead-input.dto';

@Injectable()
export class UpdateLeadUseCase implements UseCase<UpdateLeadInput, Lead> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(input: UpdateLeadInput): Promise<Lead> {
    const lead = await this.leadRepository.findById(input.id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${input.id} not found`);
    }

    lead.updateInformation(input.data);

    if (input.data.status) {
      lead.updateStatus(input.data.status);
    }

    return this.leadRepository.update(lead);
  }
}

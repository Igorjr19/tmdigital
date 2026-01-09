import { Injectable } from '@nestjs/common';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class DeleteLeadUseCase implements UseCase<string, void> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(id: string): Promise<void> {
    const lead = await this.leadRepository.findById(id);

    if (!lead) {
      throw new ResourceNotFoundException(
        `Lead with ID ${id} not found`,
        DomainErrorCodes.LEAD_NOT_FOUND,
      );
    }

    await this.leadRepository.delete(id);
  }
}

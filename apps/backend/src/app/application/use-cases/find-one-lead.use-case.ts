import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class FindOneLeadUseCase implements UseCase<string, Lead> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findByIdWithRelations(id);

    if (!lead) {
      throw new ResourceNotFoundException(
        `Lead with ID ${id} not found`,
        DomainErrorCodes.LEAD_NOT_FOUND,
      );
    }

    return lead;
  }
}

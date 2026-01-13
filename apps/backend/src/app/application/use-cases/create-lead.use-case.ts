import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { ResourceAlreadyExistsException } from '../../domain/exceptions/resource-already-exists.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { CreateLeadDto } from '../dtos/create-lead.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class CreateLeadUseCase implements UseCase<CreateLeadDto, Lead> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(input: CreateLeadDto): Promise<Lead> {
    const sanitizedDocument = input.document.replace(/\D/g, '');
    const existingLeadIncludingDeleted =
      await this.leadRepository.findIncludingDeletedByDocument(
        sanitizedDocument,
      );

    if (existingLeadIncludingDeleted) {
      if (existingLeadIncludingDeleted.deletedAt) {
        existingLeadIncludingDeleted.restore();
        existingLeadIncludingDeleted.updateInformation(input);
        existingLeadIncludingDeleted.updateStatus(
          input.status ?? LeadStatus.NEW,
        );
        return this.leadRepository.save(existingLeadIncludingDeleted);
      }

      throw new ResourceAlreadyExistsException(
        `Lead with document ${input.document} already exists`,
        DomainErrorCodes.LEAD_ALREADY_EXISTS,
      );
    }

    const lead = Lead.create({
      ...input,
      status: input.status ?? LeadStatus.NEW,
    });

    return this.leadRepository.save(lead);
  }
}

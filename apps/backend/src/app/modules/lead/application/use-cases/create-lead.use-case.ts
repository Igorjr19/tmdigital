import { ConflictException, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead, LeadStatus } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { CreateLeadDto } from '../dtos/create-lead.dto';

@Injectable()
export class CreateLeadUseCase implements UseCase<CreateLeadDto, Lead> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(input: CreateLeadDto): Promise<Lead> {
    const existing = await this.leadRepository.findByDocument(input.document);
    if (existing) {
      throw new ConflictException(
        `Lead with document ${input.document} already exists`,
      );
    }

    const lead = Lead.create({
      ...input,
      status: input.status || LeadStatus.NEW,
    });

    return this.leadRepository.save(lead);
  }
}

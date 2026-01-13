import { Injectable } from '@nestjs/common';
import { RuralProperty } from '../../domain/entities/rural-property.entity';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { CreateRuralPropertyDto } from '../dtos/create-rural-property.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class AddRuralPropertyUseCase implements UseCase<
  CreateRuralPropertyDto,
  RuralProperty
> {
  constructor(
    private readonly ruralPropertyRepository: RuralPropertyRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(input: CreateRuralPropertyDto): Promise<RuralProperty> {
    const lead = await this.leadRepository.findById(input.leadId);
    if (!lead) {
      throw new ResourceNotFoundException(
        `Lead with ID ${input.leadId} not found`,
        DomainErrorCodes.LEAD_NOT_FOUND,
      );
    }

    const ruralProperty = RuralProperty.create(input);
    const savedProperty =
      await this.ruralPropertyRepository.save(ruralProperty);

    const leadWithRelations = await this.leadRepository.findByIdWithRelations(
      input.leadId,
    );

    if (leadWithRelations) {
      leadWithRelations.calculatePotential();
      await this.leadRepository.update(leadWithRelations);
    }

    return savedProperty;
  }
}

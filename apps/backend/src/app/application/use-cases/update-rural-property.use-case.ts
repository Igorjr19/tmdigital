import { Injectable } from '@nestjs/common';
import { RuralProperty } from '../../domain/entities/rural-property.entity';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { BusinessRuleException } from '../../domain/exceptions/business-rule.exception';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { UpdateRuralPropertyInput } from '../interfaces/update-rural-property-input';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class UpdateRuralPropertyUseCase implements UseCase<
  UpdateRuralPropertyInput,
  RuralProperty
> {
  constructor(
    private readonly ruralPropertyRepository: RuralPropertyRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(input: UpdateRuralPropertyInput): Promise<RuralProperty> {
    const property = await this.ruralPropertyRepository.findById(input.id);
    if (!property) {
      throw new ResourceNotFoundException(
        `Rural Property with ID ${input.id} not found`,
        DomainErrorCodes.RURAL_PROPERTY_NOT_FOUND,
      );
    }

    if (property.leadId !== input.leadId) {
      throw new BusinessRuleException(
        `Property ${input.id} does not belong to Lead ${input.leadId}`,
        DomainErrorCodes.RURAL_PROPERTY_NOT_FOUND,
      );
    }

    if (input.data) {
      if (input.data.cropProductions) {
        await this.ruralPropertyRepository.deleteCropProductions(property.id);
      }
      property.updateInformation(input.data);
    }

    const updatedProperty = await this.ruralPropertyRepository.update(property);

    const leadWithRelations = await this.leadRepository.findByIdWithRelations(
      property.leadId,
    );

    if (leadWithRelations) {
      leadWithRelations.calculatePotential();
      await this.leadRepository.update(leadWithRelations);
    }

    const finalProperty =
      await this.ruralPropertyRepository.findByIdWithRelations(input.id);

    if (!finalProperty) {
      return updatedProperty;
    }

    return finalProperty;
  }
}

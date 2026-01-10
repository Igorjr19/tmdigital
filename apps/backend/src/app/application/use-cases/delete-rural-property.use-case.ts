import { Injectable } from '@nestjs/common';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { BusinessRuleException } from '../../domain/exceptions/business-rule.exception';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class DeleteRuralPropertyUseCase implements UseCase<
  { id: string; leadId: string },
  void
> {
  constructor(
    private readonly ruralPropertyRepository: RuralPropertyRepository,
  ) {}

  async execute(input: { id: string; leadId: string }): Promise<void> {
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

    await this.ruralPropertyRepository.delete(input.id);
  }
}

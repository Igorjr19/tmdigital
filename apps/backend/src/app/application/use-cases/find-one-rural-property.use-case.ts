import { Injectable } from '@nestjs/common';
import { RuralProperty } from '../../domain/entities/rural-property.entity';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { UseCase } from '../interfaces/use-case.interface';

export interface FindOneRuralPropertyInput {
  leadId: string;
  propertyId: string;
}

@Injectable()
export class FindOneRuralPropertyUseCase implements UseCase<
  FindOneRuralPropertyInput,
  RuralProperty
> {
  constructor(
    private readonly ruralPropertyRepository: RuralPropertyRepository,
  ) {}

  async execute(input: FindOneRuralPropertyInput): Promise<RuralProperty> {
    const property = await this.ruralPropertyRepository.findByIdWithRelations(
      input.propertyId,
    );

    if (!property) {
      throw new ResourceNotFoundException(
        `Rural Property with ID ${input.propertyId} not found`,
        DomainErrorCodes.RURAL_PROPERTY_NOT_FOUND,
      );
    }

    return property;
  }
}

import { Injectable } from '@nestjs/common';
import { DomainErrorCodes } from '../../domain/enums/domain-error-codes.enum';
import { ResourceNotFoundException } from '../../domain/exceptions/resource-not-found.exception';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class DeleteRuralPropertyUseCase implements UseCase<string, void> {
  constructor(
    private readonly ruralPropertyRepository: RuralPropertyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const property = await this.ruralPropertyRepository.findById(id);

    if (!property) {
      throw new ResourceNotFoundException(
        `Rural Property with ID ${id} not found`,
        DomainErrorCodes.RURAL_PROPERTY_NOT_FOUND,
      );
    }

    await this.ruralPropertyRepository.delete(id);
  }
}

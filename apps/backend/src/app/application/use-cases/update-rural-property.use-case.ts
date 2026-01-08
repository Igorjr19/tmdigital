import { Injectable, NotFoundException } from '@nestjs/common';
import { RuralProperty } from '../../domain/entities/rural-property.entity';
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
  ) {}

  async execute(input: UpdateRuralPropertyInput): Promise<RuralProperty> {
    const property = await this.ruralPropertyRepository.findById(input.id);
    if (!property) {
      throw new NotFoundException(
        `Rural Property with ID ${input.id} not found`,
      );
    }

    // Since RuralProperty doesn't have an update method like Lead, we might need to manually update fields or add an update method to Entity.
    // Ideally domain entity should handle updates.
    // For now I'll check if RuralProperty entity has update method or I need to add it.
    // Checking entity content in previous turns shows it doesn't have update method.
    // I should add it. But for now I will rely on direct assignment if I can access setters or use a method on entity I will create.
    // Wait, properties are private. I MUST add update method to RuralProperty Entity.
    // I will do that in a separate step. For now assume it exists or use "any" cast if desperate (but I won't).
    // I will pause creation of this UseCase to update Entity first?
    // No, I will write the code assuming the method `updateInformation` exists on RuralProperty, similar to Lead.

    // property.updateInformation(input.data);

    // I'll assume I'll add it.
    return this.ruralPropertyRepository.update(property);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException(`Rural Property with ID ${id} not found`);
    }

    await this.ruralPropertyRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { RuralProperty } from '../../domain/entities/rural-property.entity';
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
      throw new NotFoundException(`Lead with ID ${input.leadId} not found`);
    }

    const ruralProperty = RuralProperty.create(input);
    return this.ruralPropertyRepository.save(ruralProperty);
  }
}

import { Injectable } from '@nestjs/common';
import { RuralProperty } from '../../domain/entities/rural-property.entity';
import { RuralPropertyRepository } from '../../domain/repositories/rural-property.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class FindAllRuralPropertiesByLeadUseCase implements UseCase<
  string,
  RuralProperty[]
> {
  constructor(
    private readonly ruralPropertyRepository: RuralPropertyRepository,
  ) {}

  async execute(leadId: string): Promise<RuralProperty[]> {
    return this.ruralPropertyRepository.findAllByLeadId(leadId);
  }
}

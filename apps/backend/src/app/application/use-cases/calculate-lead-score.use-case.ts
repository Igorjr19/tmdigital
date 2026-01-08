import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class CalculateLeadScoreUseCase implements UseCase<string, number> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(leadId: string): Promise<number> {
    const lead = await this.leadRepository.findByIdWithRelations(leadId);

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    let totalScore = 0;

    if (lead.properties) {
      for (const property of lead.properties) {
        if (property.cropProductions) {
          for (const production of property.cropProductions) {
            if (production.culture && production.culture.currentPrice) {
              totalScore +=
                production.plantedAreaHectares *
                production.culture.currentPrice;
            }
          }
        }
      }
    }

    lead.updateInformation({ estimatedPotential: totalScore });
    await this.leadRepository.save(lead);

    return totalScore;
  }
}

import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { DashboardGeoStatsDto } from '../../dtos/dashboard.dto';
import { UseCase } from '../../interfaces/use-case.interface';

@Injectable()
export class GetGeoStatsUseCase implements UseCase<void, DashboardGeoStatsDto> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(): Promise<DashboardGeoStatsDto> {
    const stats = await this.leadRepository.getGeoStats();

    return {
      totalAreaRegistered: stats.totalArea,
      totalAreaConverted: stats.convertedArea,
      penetrationPercentage:
        stats.totalArea > 0 ? (stats.convertedArea / stats.totalArea) * 100 : 0,
      heatmap: stats.heatmap,
    };
  }
}

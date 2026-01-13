import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { DashboardForecastDto } from '../../dtos/dashboard.dto';
import { UseCase } from '../../interfaces/use-case.interface';

@Injectable()
export class GetForecastUseCase implements UseCase<void, DashboardForecastDto> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(): Promise<DashboardForecastDto> {
    const forecast = await this.leadRepository.getForecast();
    return {
      totalPotential: forecast.totalPotential,
      weightedForecast: forecast.weightedForecast,
    };
  }
}

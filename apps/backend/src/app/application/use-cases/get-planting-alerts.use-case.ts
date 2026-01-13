import { Injectable } from '@nestjs/common';
import { CultureRepository } from '../../domain/repositories/culture.repository';
import { DashboardPlantingAlertDto } from '../dtos/dashboard.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class GetPlantingAlertsUseCase implements UseCase<
  void,
  DashboardPlantingAlertDto[]
> {
  constructor(private readonly cultureRepository: CultureRepository) {}

  async execute(): Promise<DashboardPlantingAlertDto[]> {
    const currentMonth = new Date().getMonth() + 1;
    const cultures = await this.cultureRepository.findPlantingIn([
      currentMonth,
    ]);

    return cultures.map((c) => ({
      culture: c.name,
      plantingMonths: c.plantingMonths || [],
      alertMessage: `Janela de plantio para ${c.name} está aberta!`,
    }));
  }
}

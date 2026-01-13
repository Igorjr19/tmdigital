import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { DashboardMarketShareDto } from '../dtos/dashboard.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class GetMarketShareUseCase implements UseCase<
  void,
  DashboardMarketShareDto[]
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(): Promise<DashboardMarketShareDto[]> {
    const shares = await this.leadRepository.getMarketShare();
    return shares.map((s) => ({
      supplier: s.supplier,
      count: s.count,
      sharePercentage: s.percentage,
    }));
  }
}

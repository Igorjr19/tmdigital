import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { DashboardStaleLeadDto } from '../../dtos/dashboard.dto';
import { LeadDto } from '../../dtos/lead.dto';
import { UseCase } from '../../interfaces/use-case.interface';

@Injectable()
export class GetStaleLeadsUseCase implements UseCase<
  void,
  DashboardStaleLeadDto[]
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(): Promise<DashboardStaleLeadDto[]> {
    const leads = await this.leadRepository.findStale(15);
    return leads.map(LeadDto.fromDomain);
  }
}

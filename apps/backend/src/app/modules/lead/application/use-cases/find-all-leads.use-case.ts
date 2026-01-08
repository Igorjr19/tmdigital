import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';

@Injectable()
export class FindAllLeadsUseCase implements UseCase<void, Lead[]> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(): Promise<Lead[]> {
    return this.leadRepository.findAll();
  }
}

import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../../shared/application/dtos/pagination.dto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';

@Injectable()
export class FindAllLeadsUseCase implements UseCase<PaginationDto, Lead[]> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(params?: PaginationDto): Promise<Lead[]> {
    return this.leadRepository.findAll(params);
  }
}

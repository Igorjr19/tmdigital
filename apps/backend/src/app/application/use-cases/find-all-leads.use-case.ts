import { Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { PaginationDto } from '../dtos/pagination.dto';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class FindAllLeadsUseCase implements UseCase<
  PaginationDto,
  { items: Lead[]; total: number }
> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(
    params?: PaginationDto,
  ): Promise<{ items: Lead[]; total: number }> {
    return this.leadRepository.findAll(params);
  }
}

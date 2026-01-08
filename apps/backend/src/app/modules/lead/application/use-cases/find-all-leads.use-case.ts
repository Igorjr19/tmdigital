import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../../shared/application/dtos/pagination.dto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { ILeadRepository } from '../../domain/repositories/lead.repository'; // Changed interface name

@Injectable()
export class FindAllLeadsUseCase implements UseCase<PaginationDto, Lead[]> {
  constructor(private readonly leadRepository: ILeadRepository) {}

  async execute(params?: PaginationDto): Promise<Lead[]> {
    return this.leadRepository.findAll(params);
  }
}

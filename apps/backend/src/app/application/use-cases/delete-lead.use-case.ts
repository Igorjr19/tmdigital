import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class DeleteLeadUseCase implements UseCase<string, void> {
  constructor(private readonly leadRepository: LeadRepository) {}

  async execute(id: string): Promise<void> {
    const lead = await this.leadRepository.findById(id);

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    await this.leadRepository.delete(id);
  }
}

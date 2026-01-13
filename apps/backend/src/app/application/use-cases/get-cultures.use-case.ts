import { Injectable } from '@nestjs/common';
import { Culture } from '../../domain/entities/culture.entity';
import { CultureRepository } from '../../domain/repositories/culture.repository';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class GetCulturesUseCase implements UseCase<void, Culture[]> {
  constructor(private readonly cultureRepository: CultureRepository) {}

  async execute(): Promise<Culture[]> {
    return this.cultureRepository.findAll();
  }
}

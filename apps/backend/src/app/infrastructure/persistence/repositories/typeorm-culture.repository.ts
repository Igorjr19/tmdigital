import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Culture } from '../../../domain/entities/culture.entity';
import { CultureRepository } from '../../../domain/repositories/culture.repository';
import { CultureSchema } from '../schemas/culture.schema';

@Injectable()
export class TypeOrmCultureRepository implements CultureRepository {
  constructor(
    @InjectRepository(CultureSchema)
    private readonly repository: Repository<Culture>,
  ) {}

  async save(culture: Culture): Promise<Culture> {
    return this.repository.save(culture);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async find(): Promise<Culture[]> {
    return this.repository.find();
  }
}

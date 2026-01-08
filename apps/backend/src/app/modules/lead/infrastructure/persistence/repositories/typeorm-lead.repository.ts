import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../../../../shared/application/dtos/pagination.dto';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { LeadSchema } from '../entities/lead.schema';
import { LeadMapper } from '../mappers/lead.mapper';

@Injectable()
export class TypeOrmLeadRepository implements LeadRepository {
  constructor(
    @InjectRepository(LeadSchema)
    private readonly typeOrmRepository: Repository<LeadSchema>,
  ) {}

  async save(lead: Lead): Promise<Lead> {
    const schema = LeadMapper.toPersistence(lead);
    const savedSchema = await this.typeOrmRepository.save(schema);
    return LeadMapper.toDomain(savedSchema);
  }

  async findById(id: string): Promise<Lead | null> {
    const schema = await this.typeOrmRepository.findOne({ where: { id } });
    if (!schema) return null;
    return LeadMapper.toDomain(schema);
  }

  async findByDocument(document: string): Promise<Lead | null> {
    const schema = await this.typeOrmRepository.findOne({
      where: { document },
    });
    if (!schema) return null;
    return LeadMapper.toDomain(schema);
  }

  async findAll(params?: PaginationDto): Promise<Lead[]> {
    const skip = ((params?.page || 1) - 1) * (params?.limit || 10);
    const take = params?.limit || 10;

    const schemas = await this.typeOrmRepository.find({
      skip,
      take,
    });
    return schemas.map(LeadMapper.toDomain);
  }

  async update(lead: Lead): Promise<Lead> {
    // In TypeORM save() handles insert/update based on ID presence, but semantically 'update' implies existence check logic if strict.
    // For now, save() is sufficient for full entity update.
    return this.save(lead);
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }
}

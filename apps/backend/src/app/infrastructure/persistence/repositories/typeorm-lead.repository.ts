import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetLeadsDto } from '../../../application/dtos/get-leads.dto';
import { PaginationDto } from '../../../application/dtos/pagination.dto';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { HandleDbErrors } from '../decorators/handle-db-errors.decorator';
import { LeadMapper } from '../mappers/lead.mapper';
import { LeadSchema } from '../schemas/lead.schema';

@Injectable()
export class TypeOrmLeadRepository implements LeadRepository {
  constructor(
    @InjectRepository(LeadSchema)
    private readonly typeOrmRepository: Repository<LeadSchema>,
  ) {}

  @HandleDbErrors()
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

  async findByIdWithRelations(id: string): Promise<Lead | null> {
    const schema = await this.typeOrmRepository.findOne({
      where: { id },
      relations: [
        'properties',
        'properties.cropProductions',
        'properties.cropProductions.culture',
      ],
    });
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

  async findNearby(
    lat: number,
    long: number,
    rangeKm: number,
    params?: PaginationDto,
  ): Promise<{ items: Lead[]; total: number }> {
    const skip = ((params?.page || 1) - 1) * (params?.limit || 10);
    const take = params?.limit || 10;

    const [schemas, total] = await this.typeOrmRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.properties', 'property')
      .where(
        `ST_DWithin(property.location, ST_SetSRID(ST_MakePoint(:long, :lat), 4326), :range)`,
      )
      .setParameters({
        lat,
        long,
        range: rangeKm * 1000,
      })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: schemas.map(LeadMapper.toDomain),
      total,
    };
  }

  async findAll(
    params?: GetLeadsDto,
  ): Promise<{ items: Lead[]; total: number }> {
    const skip = ((params?.page || 1) - 1) * (params?.limit || 10);
    const take = params?.limit || 10;

    const query = this.typeOrmRepository.createQueryBuilder('lead');

    if (params?.name) {
      query.andWhere('lead.name ILIKE :name', { name: `%${params.name}%` });
    }

    if (params?.status) {
      query.andWhere('lead.status = :status', { status: params.status });
    }

    const [schemas, total] = await query
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: schemas.map(LeadMapper.toDomain),
      total,
    };
  }

  async update(lead: Lead): Promise<Lead> {
    return this.save(lead);
  }

  async delete(id: string): Promise<void> {
    const schema = await this.typeOrmRepository.findOne({
      where: { id },
      relations: ['properties'],
    });

    if (schema) {
      await this.typeOrmRepository.softRemove(schema);
    }
  }
}

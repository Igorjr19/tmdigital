import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetLeadsDto } from '../../../application/dtos/get-leads.dto';
import { PaginationDto } from '../../../application/dtos/pagination.dto';
import { ItemCount } from '../../../application/interfaces/item-count.interface';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
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

  async findIncludingDeletedByDocument(document: string): Promise<Lead | null> {
    const schema = await this.typeOrmRepository.findOne({
      where: { document },
      withDeleted: true,
    });
    if (!schema) return null;
    return LeadMapper.toDomain(schema);
  }

  async findNearby(
    lat: number,
    long: number,
    range: number,
    params?: PaginationDto,
  ): Promise<ItemCount<Lead>> {
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
        range: range,
      })
      .orderBy('lead.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: schemas.map(LeadMapper.toDomain),
      total,
    };
  }

  async findAll(params?: GetLeadsDto): Promise<ItemCount<Lead>> {
    const skip = ((params?.page || 1) - 1) * (params?.limit || 10);
    const take = params?.limit || 10;

    const query = this.typeOrmRepository.createQueryBuilder('lead');
    query.leftJoinAndSelect('lead.properties', 'property');

    if (params?.name) {
      query.andWhere('lead.name ILIKE :name', { name: `%${params.name}%` });
    }

    if (params?.document) {
      query.andWhere('lead.document ILIKE :document', {
        document: `%${params.document}%`,
      });
    }

    if (params?.status) {
      query.andWhere('lead.status = :status', { status: params.status });
    }

    const [schemas, total] = await query
      .skip(skip)
      .take(take)
      .orderBy(
        params?.sortBy ? `lead.${params.sortBy}` : 'lead.createdAt',
        params?.sortOrder || 'DESC',
      )
      .getManyAndCount();

    return {
      items: schemas.map(LeadMapper.toDomain),
      total,
    };
  }

  async findStale(daysSinceUpdate: number): Promise<Lead[]> {
    const date = new Date();
    date.setDate(date.getDate() - daysSinceUpdate);

    const schemas = await this.typeOrmRepository
      .createQueryBuilder('lead')
      .where('lead.status IN (:...statuses)', {
        statuses: [LeadStatus.QUALIFIED],
      })
      .andWhere('lead.updatedAt < :date', { date })
      .getMany();

    return schemas.map(LeadMapper.toDomain);
  }

  async getMarketShare(): Promise<
    { supplier: string; count: number; percentage: number }[]
  > {
    const total = await this.typeOrmRepository.count();
    const raw = await this.typeOrmRepository
      .createQueryBuilder('lead')
      .select('lead.currentSupplier', 'supplier')
      .addSelect('COUNT(lead.id)', 'count')
      .where('lead.currentSupplier IS NOT NULL')
      .groupBy('lead.currentSupplier')
      .getRawMany();

    return raw.map((r) => ({
      supplier: r.supplier,
      count: Number(r.count),
      percentage: total > 0 ? (Number(r.count) / total) * 100 : 0,
    }));
  }

  async getGeoStats(): Promise<{
    totalArea: number;
    convertedArea: number;
    heatmap: { lat: number; lng: number; weight: number }[];
  }> {
    const query = this.typeOrmRepository.manager
      .createQueryBuilder('rural_properties', 'rp')
      .leftJoin('leads', 'l', 'l.id = rp.lead_id');

    const totalAreaResult = await query
      .select('SUM(rp.productive_area_hectares)', 'total')
      .getRawOne();

    const convertedAreaResult = await this.typeOrmRepository.manager
      .createQueryBuilder('rural_properties', 'rp')
      .leftJoin('leads', 'l', 'l.id = rp.lead_id')
      .where('l.status IN (:...statuses)', { statuses: [LeadStatus.CONVERTED] })
      .select('SUM(rp.productive_area_hectares)', 'total')
      .getRawOne();

    const heatmapSafe = await this.typeOrmRepository
      .createQueryBuilder('lead')
      .leftJoin('lead.properties', 'property')
      .select('ST_Y(property.location::geometry)', 'lat')
      .addSelect('ST_X(property.location::geometry)', 'lng')
      .addSelect('lead.estimatedPotential', 'weight')
      .where('property.location IS NOT NULL')
      .getRawMany();

    return {
      totalArea: Number(totalAreaResult?.total || 0),
      convertedArea: Number(convertedAreaResult?.total || 0),
      heatmap: heatmapSafe.map((r) => ({
        lat: r.lat,
        lng: r.lng,
        weight: Number(r.weight || 0),
      })),
    };
  }

  async getForecast(): Promise<{
    totalPotential: number;
    countByStatus: Record<string, number>;
  }> {
    const raw = await this.typeOrmRepository
      .createQueryBuilder('lead')
      .select('SUM(lead.estimatedPotential)', 'total')
      .addSelect('lead.status', 'status')
      .addSelect('COUNT(lead.id)', 'count')
      .where('lead.deletedAt IS NULL')
      .groupBy('lead.status')
      .getRawMany();

    const totalPotential = raw.reduce(
      (sum, r) => sum + Number(r.total || 0),
      0,
    );
    const countByStatus = raw.reduce((acc, r) => {
      acc[r.status] = Number(r.count);
      return acc;
    }, {});

    return {
      totalPotential,
      countByStatus,
    };
  }

  async update(lead: Lead): Promise<Lead> {
    const schema = LeadMapper.toPersistence(lead);
    await this.typeOrmRepository.update(schema.id, {
      name: schema.name,
      document: schema.document,
      currentSupplier: schema.currentSupplier,
      status: schema.status,
      estimatedPotential: schema.estimatedPotential,
      notes: schema.notes,
      phone: schema.phone,
      updatedAt: schema.updatedAt,
    });
    return lead;
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

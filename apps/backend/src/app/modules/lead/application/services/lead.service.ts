import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lead, LeadStatus } from '../../domain/entities/lead.entity';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { CreateLeadDto } from '../dtos/create-lead.dto';
import { UpdateLeadDto } from '../dtos/update-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @Inject('ILeadRepository')
    private readonly leadRepository: LeadRepository,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const existing = await this.leadRepository.findByDocument(
      createLeadDto.document,
    );
    if (existing) {
      throw new ConflictException(
        `Lead with document ${createLeadDto.document} already exists`,
      );
    }

    const lead = Lead.create({
      ...createLeadDto,
      status: createLeadDto.status || LeadStatus.NEW,
    });

    return this.leadRepository.save(lead);
  }

  async findAll(): Promise<Lead[]> {
    return this.leadRepository.findAll();
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    // Using domain method to update
    lead.updateInformation(updateLeadDto);

    // Explicit status update if provided
    if (updateLeadDto.status) {
      lead.updateStatus(updateLeadDto.status);
    }

    return this.leadRepository.update(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id); // Ensure exists
    await this.leadRepository.delete(lead.id);
  }
}

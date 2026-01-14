import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { UpdateLeadDto } from '../../dtos/update-lead.dto';
import { UpdateLeadUseCase } from '../update-lead.use-case';

describe('UpdateLeadUseCase', () => {
  let useCase: UpdateLeadUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateLeadUseCase,
          useFactory: (repo: LeadRepository) => new UpdateLeadUseCase(repo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateLeadUseCase>(UpdateLeadUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update a lead successfully', async () => {
    const leadId = '123';
    const existingLead = Lead.create({
      id: leadId,
      name: 'Old Name',
      document: '12345678901',
      phone: '11999999999',
      status: LeadStatus.NEW,
      estimatedPotential: 1000,
    });

    const updateData: UpdateLeadDto = {
      name: 'New Name',
      status: LeadStatus.QUALIFIED,
    };

    mockLeadRepository.findById.mockResolvedValue(existingLead);
    mockLeadRepository.update.mockResolvedValue({
      ...existingLead,
      ...updateData,
    });

    const result = await useCase.execute({ id: leadId, data: updateData });

    expect(leadRepository.findById).toHaveBeenCalledWith(leadId);
    expect(leadRepository.update).toHaveBeenCalled();
    expect(result.name).toBe(updateData.name);
    expect(result.status).toBe(updateData.status);
  });

  it('should throw ResourceNotFoundException if lead is not found', async () => {
    const leadId = '123';
    const updateData: UpdateLeadDto = {
      name: 'New Name',
    };

    mockLeadRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: leadId, data: updateData }),
    ).rejects.toThrow(ResourceNotFoundException);
    expect(leadRepository.findById).toHaveBeenCalledWith(leadId);
    expect(leadRepository.update).not.toHaveBeenCalled();
  });
});

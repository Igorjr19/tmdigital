import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { FindOneLeadUseCase } from '../find-one-lead.use-case';

describe('FindOneLeadUseCase', () => {
  let useCase: FindOneLeadUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findByIdWithRelations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FindOneLeadUseCase,
          useFactory: (repo: LeadRepository) => new FindOneLeadUseCase(repo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOneLeadUseCase>(FindOneLeadUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a lead if found', async () => {
    const leadId = '123';
    const mockLead = Lead.create({
      id: leadId,
      name: 'Test Lead',
      document: '12345678901',
      status: LeadStatus.NEW,
      estimatedPotential: 1000,
    });

    mockLeadRepository.findByIdWithRelations.mockResolvedValue(mockLead);

    const result = await useCase.execute(leadId);

    expect(leadRepository.findByIdWithRelations).toHaveBeenCalledWith(leadId);
    expect(result).toBe(mockLead);
  });

  it('should throw ResourceNotFoundException if lead is not found', async () => {
    const leadId = '123';
    mockLeadRepository.findByIdWithRelations.mockResolvedValue(null);

    await expect(useCase.execute(leadId)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(leadRepository.findByIdWithRelations).toHaveBeenCalledWith(leadId);
  });
});

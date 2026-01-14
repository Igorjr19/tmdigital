import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { DeleteLeadUseCase } from '../delete-lead.use-case';

describe('DeleteLeadUseCase', () => {
  let useCase: DeleteLeadUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteLeadUseCase,
          useFactory: (repo: LeadRepository) => new DeleteLeadUseCase(repo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteLeadUseCase>(DeleteLeadUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should delete a lead successfully', async () => {
    const leadId = '123';
    const existingLead = Lead.create({
      id: leadId,
      name: 'Test Lead',
      document: '12345678901',
      phone: '11999999999',
      status: LeadStatus.NEW,
      estimatedPotential: 1000,
    });

    mockLeadRepository.findById.mockResolvedValue(existingLead);

    await useCase.execute(leadId);

    expect(leadRepository.findById).toHaveBeenCalledWith(leadId);
    expect(leadRepository.delete).toHaveBeenCalledWith(leadId);
  });

  it('should throw ResourceNotFoundException if lead is not found', async () => {
    const leadId = '123';
    mockLeadRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(leadId)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(leadRepository.findById).toHaveBeenCalledWith(leadId);
    expect(leadRepository.delete).not.toHaveBeenCalled();
  });
});

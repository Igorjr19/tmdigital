import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { GetLeadsDto } from '../../dtos/get-leads.dto';
import { FindAllLeadsUseCase } from '../find-all-leads.use-case';

describe('FindAllLeadsUseCase', () => {
  let useCase: FindAllLeadsUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FindAllLeadsUseCase,
          useFactory: (repo: LeadRepository) => new FindAllLeadsUseCase(repo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllLeadsUseCase>(FindAllLeadsUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a list of leads', async () => {
    const mockLeads = [
      Lead.create({
        name: 'Lead 1',
        document: '111',
        status: LeadStatus.NEW,
        estimatedPotential: 1000,
      }),
      Lead.create({
        name: 'Lead 2',
        document: '222',
        status: LeadStatus.NEW,
        estimatedPotential: 2000,
      }),
    ];

    const mockResponse = {
      items: mockLeads,
      total: 2,
    };

    mockLeadRepository.findAll.mockResolvedValue(mockResponse);

    const query: GetLeadsDto = { page: 1, limit: 10 };
    const result = await useCase.execute(query);

    expect(leadRepository.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(mockResponse);
  });

  it('should pass sorting parameters to repository', async () => {
    const mockResponse = { items: [], total: 0 };
    mockLeadRepository.findAll.mockResolvedValue(mockResponse);

    const query: GetLeadsDto = {
      page: 1,
      limit: 10,
      sortBy: 'estimatedPotential',
      sortOrder: 'DESC',
    };

    await useCase.execute(query);

    expect(leadRepository.findAll).toHaveBeenCalledWith(query);
  });

  it('should pass document filter to repository', async () => {
    const mockResponse = { items: [], total: 0 };
    mockLeadRepository.findAll.mockResolvedValue(mockResponse);

    const query: GetLeadsDto = {
      page: 1,
      limit: 10,
      document: '123',
    };

    await useCase.execute(query);

    expect(leadRepository.findAll).toHaveBeenCalledWith(query);
  });
});

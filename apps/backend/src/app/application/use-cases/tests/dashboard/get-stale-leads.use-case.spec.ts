import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../../domain/enums/lead-status.enum';
import { LeadRepository } from '../../../../domain/repositories/lead.repository';
import { GetStaleLeadsUseCase } from '../../dashboard/get-stale-leads.use-case';

describe('GetStaleLeadsUseCase', () => {
  let useCase: GetStaleLeadsUseCase;
  let leadRepository: LeadRepository;

  const mockLeads: Lead[] = [
    Lead.create({
      id: '1',
      name: 'Stale Lead 1',
      document: '123',
      status: LeadStatus.QUALIFIED,
      createdAt: new Date(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      estimatedPotential: 100,
    }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStaleLeadsUseCase,
        {
          provide: LeadRepository,
          useValue: {
            findStale: jest.fn().mockResolvedValue(mockLeads),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetStaleLeadsUseCase>(GetStaleLeadsUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return stale leads dto', async () => {
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Stale Lead 1');
    expect(leadRepository.findStale).toHaveBeenCalledWith(15);
  });
});

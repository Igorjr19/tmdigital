import { Test, TestingModule } from '@nestjs/testing';
import { LeadRepository } from '../../../../domain/repositories/lead.repository';
import { GetMarketShareUseCase } from '../../dashboard/get-market-share.use-case';

describe('GetMarketShareUseCase', () => {
  let useCase: GetMarketShareUseCase;
  let leadRepository: LeadRepository;

  const mockShares = [
    { supplier: 'Bayer', count: 10, percentage: 50 },
    { supplier: 'Syngenta', count: 10, percentage: 50 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMarketShareUseCase,
        {
          provide: LeadRepository,
          useValue: {
            getMarketShare: jest.fn().mockResolvedValue(mockShares),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetMarketShareUseCase>(GetMarketShareUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return market share dto', async () => {
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
    expect(result[0].supplier).toBe('Bayer');
    expect(result[0].sharePercentage).toBe(50);
    expect(leadRepository.getMarketShare).toHaveBeenCalled();
  });
});

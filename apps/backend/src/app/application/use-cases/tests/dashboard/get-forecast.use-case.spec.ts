import { Test, TestingModule } from '@nestjs/testing';
import { LeadRepository } from '../../../../domain/repositories/lead.repository';
import { GetForecastUseCase } from '../../get-forecast.use-case';

describe('GetForecastUseCase', () => {
  let useCase: GetForecastUseCase;
  let leadRepository: LeadRepository;

  const mockForecast = {
    totalPotential: 100000,
    countByStatus: { NEW: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetForecastUseCase,
        {
          provide: LeadRepository,
          useValue: {
            getForecast: jest.fn().mockResolvedValue(mockForecast),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetForecastUseCase>(GetForecastUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return forecast dto', async () => {
    const result = await useCase.execute();
    expect(result.totalPotential).toBe(100000);
    expect(result.countByStatus).toEqual({ NEW: 1 });
    expect(leadRepository.getForecast).toHaveBeenCalled();
  });
});

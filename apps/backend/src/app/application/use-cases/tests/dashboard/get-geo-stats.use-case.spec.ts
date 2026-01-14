import { Test, TestingModule } from '@nestjs/testing';
import { LeadRepository } from '../../../../domain/repositories/lead.repository';
import { GetGeoStatsUseCase } from '../../get-geo-stats.use-case';

describe('GetGeoStatsUseCase', () => {
  let useCase: GetGeoStatsUseCase;
  let leadRepository: LeadRepository;

  const mockStats = {
    totalArea: 1000,
    convertedArea: 500,
    heatmap: [{ lat: 10, lng: 20, weight: 100 }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetGeoStatsUseCase,
        {
          provide: LeadRepository,
          useValue: {
            getGeoStats: jest.fn().mockResolvedValue(mockStats),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetGeoStatsUseCase>(GetGeoStatsUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return geo stats dto', async () => {
    const result = await useCase.execute();
    expect(result.totalAreaRegistered).toBe(1000);
    expect(result.totalAreaConverted).toBe(500);
    expect(result.penetrationPercentage).toBe(50);
    expect(result.heatmap).toHaveLength(1);
    expect(leadRepository.getGeoStats).toHaveBeenCalled();
  });

  it('should handle zero total area', async () => {
    jest
      .spyOn(leadRepository, 'getGeoStats')
      .mockResolvedValueOnce({ ...mockStats, totalArea: 0 });
    const result = await useCase.execute();
    expect(result.penetrationPercentage).toBe(0);
  });
});

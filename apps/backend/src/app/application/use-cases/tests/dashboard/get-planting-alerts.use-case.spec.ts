import { Test, TestingModule } from '@nestjs/testing';
import { Culture } from '../../../../domain/entities/culture.entity';
import { CultureRepository } from '../../../../domain/repositories/culture.repository';
import { GetPlantingAlertsUseCase } from '../../get-planting-alerts.use-case';

describe('GetPlantingAlertsUseCase', () => {
  let useCase: GetPlantingAlertsUseCase;
  let cultureRepository: CultureRepository;

  const mockCultures: Culture[] = [
    Culture.create({
      id: '1',
      name: 'Soja',
      plantingMonths: [1, 2, 3],
      currentPrice: 100,
    }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPlantingAlertsUseCase,
        {
          provide: CultureRepository,
          useValue: {
            findPlantingIn: jest.fn().mockResolvedValue(mockCultures),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetPlantingAlertsUseCase>(GetPlantingAlertsUseCase);
    cultureRepository = module.get<CultureRepository>(CultureRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return planting alerts dto', async () => {
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0].culture).toBe('Soja');
    expect(result[0].alertMessage).toContain('Janela de plantio para Soja');
    expect(cultureRepository.findPlantingIn).toHaveBeenCalled();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { RuralPropertyRepository } from '../../../domain/repositories/rural-property.repository';
import { DeleteRuralPropertyUseCase } from '../delete-rural-property.use-case';

describe('DeleteRuralPropertyUseCase', () => {
  let useCase: DeleteRuralPropertyUseCase;
  let ruralPropertyRepository: RuralPropertyRepository;

  const mockRuralPropertyRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteRuralPropertyUseCase,
          useFactory: (repo: RuralPropertyRepository) =>
            new DeleteRuralPropertyUseCase(repo),
          inject: [RuralPropertyRepository],
        },
        {
          provide: RuralPropertyRepository,
          useFactory: () => mockRuralPropertyRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteRuralPropertyUseCase>(
      DeleteRuralPropertyUseCase,
    );
    ruralPropertyRepository = module.get<RuralPropertyRepository>(
      RuralPropertyRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should delete a rural property successfully', async () => {
    const propId = 'prop1';
    const mockProperty = RuralProperty.create({
      id: propId,
      leadId: 'lead1',
      name: 'Farm',
      totalAreaHectares: 100,
      productiveAreaHectares: 80,
      city: 'Test City',
      state: 'TS',
      location: { type: 'Point', coordinates: [10, 20] },
      cropProductions: [],
    });

    mockRuralPropertyRepository.findById.mockResolvedValue(mockProperty);

    await useCase.execute(propId);

    expect(ruralPropertyRepository.findById).toHaveBeenCalledWith(propId);
    expect(ruralPropertyRepository.delete).toHaveBeenCalledWith(propId);
  });

  it('should throw ResourceNotFoundException if property not found', async () => {
    const propId = 'prop1';
    mockRuralPropertyRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(propId)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(ruralPropertyRepository.findById).toHaveBeenCalledWith(propId);
    expect(ruralPropertyRepository.delete).not.toHaveBeenCalled();
  });
});

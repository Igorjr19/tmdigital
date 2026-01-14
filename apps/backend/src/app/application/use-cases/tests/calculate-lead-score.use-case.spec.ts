import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { CalculateLeadScoreUseCase } from '../calculate-lead-score.use-case';

describe('CalculateLeadScoreUseCase', () => {
  let useCase: CalculateLeadScoreUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findByIdWithRelations: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CalculateLeadScoreUseCase,
          useFactory: (repo: LeadRepository) =>
            new CalculateLeadScoreUseCase(repo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useValue: mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<CalculateLeadScoreUseCase>(CalculateLeadScoreUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should calculate lead score/potential successfully', async () => {
    const leadId = '123';
    const initialPotential = 0;

    const property = RuralProperty.create({
      id: 'prop1',
      leadId: leadId,
      name: 'Farm 1',
      totalAreaHectares: 100,
      productiveAreaHectares: 80,
      city: 'Farmville',
      state: 'KS',
      location: { type: 'Point', coordinates: [0, 0] },
      cropProductions: [],
    });

    const lead = Lead.create({
      id: leadId,
      name: 'Test Lead',
      document: '12345678901',
      phone: '11999999999',
      status: LeadStatus.NEW,
      estimatedPotential: initialPotential,
    });

    lead.addProperty(property);

    jest.spyOn(lead, 'calculatePotential');

    mockLeadRepository.findByIdWithRelations.mockResolvedValue(lead);
    mockLeadRepository.save.mockResolvedValue(lead);

    const result = await useCase.execute(leadId);

    expect(leadRepository.findByIdWithRelations).toHaveBeenCalledWith(leadId);
    expect(lead.calculatePotential).toHaveBeenCalled();
    expect(leadRepository.save).toHaveBeenCalledWith(lead);

    expect(result.id).toBe(leadId);
  });

  it('should throw ResourceNotFoundException if lead is not found', async () => {
    const leadId = '123';
    mockLeadRepository.findByIdWithRelations.mockResolvedValue(null);

    await expect(useCase.execute(leadId)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(leadRepository.findByIdWithRelations).toHaveBeenCalledWith(leadId);
    expect(leadRepository.save).not.toHaveBeenCalled();
  });
});

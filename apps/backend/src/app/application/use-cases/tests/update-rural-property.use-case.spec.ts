import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import { Lead } from '../../../domain/entities/lead.entity';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { RuralPropertyRepository } from '../../../domain/repositories/rural-property.repository';
import { UpdateRuralPropertyInput } from '../../interfaces/update-rural-property-input';
import { UpdateRuralPropertyUseCase } from '../update-rural-property.use-case';

describe('UpdateRuralPropertyUseCase', () => {
  let useCase: UpdateRuralPropertyUseCase;
  let ruralPropertyRepository: RuralPropertyRepository;
  let leadRepository: LeadRepository;

  const mockRuralPropertyRepository = {
    findById: jest.fn(),
    findByIdWithRelations: jest.fn(),
    update: jest.fn(),
  };

  const mockLeadRepository = {
    findByIdWithRelations: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateRuralPropertyUseCase,
          useFactory: (
            propRepo: RuralPropertyRepository,
            leadRepo: LeadRepository,
          ) => new UpdateRuralPropertyUseCase(propRepo, leadRepo),
          inject: [RuralPropertyRepository, LeadRepository],
        },
        {
          provide: RuralPropertyRepository,
          useFactory: () => mockRuralPropertyRepository,
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateRuralPropertyUseCase>(
      UpdateRuralPropertyUseCase,
    );
    ruralPropertyRepository = module.get<RuralPropertyRepository>(
      RuralPropertyRepository,
    );
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update a rural property and recalculate lead potential', async () => {
    const propId = 'prop1';
    const leadId = 'lead1';
    const input: UpdateRuralPropertyInput = {
      id: propId,
      leadId: leadId,
      data: { name: 'Updated Farm Name' },
    };

    const mockProperty = RuralProperty.create({
      id: propId,
      leadId: leadId,
      name: 'Old Farm',
      totalAreaHectares: 100,
      productiveAreaHectares: 80,
      city: 'Test City',
      state: 'TS',
      location: { type: 'Point', coordinates: [10, 20] },
      cropProductions: [],
    });

    const mockLead = Lead.create({
      id: leadId,
      name: 'Test Lead',
      document: '123',
      phone: '11999999999',
      status: LeadStatus.NEW,
      estimatedPotential: 100,
    });

    mockRuralPropertyRepository.findById.mockResolvedValue(mockProperty);
    mockRuralPropertyRepository.update.mockResolvedValue(mockProperty);
    mockRuralPropertyRepository.findByIdWithRelations.mockResolvedValue(
      mockProperty,
    );
    mockLeadRepository.findByIdWithRelations.mockResolvedValue(mockLead);
    mockLeadRepository.save.mockResolvedValue(mockLead);

    jest.spyOn(mockLead, 'calculatePotential');

    const result = await useCase.execute(input);

    expect(ruralPropertyRepository.findById).toHaveBeenCalledWith(propId);
    expect(ruralPropertyRepository.update).toHaveBeenCalled();
    expect(leadRepository.findByIdWithRelations).toHaveBeenCalledWith(leadId);
    expect(mockLead.calculatePotential).toHaveBeenCalled();
    expect(leadRepository.update).toHaveBeenCalledWith(mockLead);
    expect(result.name).toBe('Updated Farm Name');
  });

  it('should throw ResourceNotFoundException if property not found', async () => {
    const propId = 'prop1';
    const input: UpdateRuralPropertyInput = {
      id: propId,
      leadId: 'lead1',
      data: { name: 'Updated Farm Name' },
    };

    mockRuralPropertyRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(ruralPropertyRepository.findById).toHaveBeenCalledWith(propId);
    expect(ruralPropertyRepository.update).not.toHaveBeenCalled();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import { Lead } from '../../../domain/entities/lead.entity';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceNotFoundException } from '../../../domain/exceptions/resource-not-found.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { RuralPropertyRepository } from '../../../domain/repositories/rural-property.repository';
import { CreateRuralPropertyDto } from '../../dtos/create-rural-property.dto';
import { AddRuralPropertyUseCase } from '../add-rural-property.use-case';

describe('AddRuralPropertyUseCase', () => {
  let useCase: AddRuralPropertyUseCase;
  let ruralPropertyRepository: RuralPropertyRepository;
  let leadRepository: LeadRepository;

  const mockRuralPropertyRepository = {
    save: jest.fn(),
  };

  const mockLeadRepository = {
    findById: jest.fn(),
    findByIdWithRelations: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AddRuralPropertyUseCase,
          useFactory: (
            propRepo: RuralPropertyRepository,
            leadRepo: LeadRepository,
          ) => new AddRuralPropertyUseCase(propRepo, leadRepo),
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

    useCase = module.get<AddRuralPropertyUseCase>(AddRuralPropertyUseCase);
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

  it('should add a rural property to a lead', async () => {
    const leadId = 'lead123';
    const createPropertyDto: CreateRuralPropertyDto = {
      leadId: leadId,
      name: 'New Farm',
      totalAreaHectares: 100,
      productiveAreaHectares: 80,
      city: 'Test City',
      state: 'TS',
      cropProductions: [],
      location: { type: 'Point', coordinates: [20, 10] },
    };

    const mockLead = Lead.create({
      id: leadId,
      name: 'Test Lead',
      document: '123',
      status: LeadStatus.NEW,
      estimatedPotential: 100,
    });

    const mockSavedProperty = RuralProperty.create({
      ...createPropertyDto,
      location: createPropertyDto.location,
    });

    mockLeadRepository.findById.mockResolvedValue(mockLead);
    mockRuralPropertyRepository.save.mockResolvedValue(mockSavedProperty);
    mockLeadRepository.findByIdWithRelations.mockResolvedValue(mockLead);
    mockLeadRepository.save.mockResolvedValue(mockLead);
    mockLeadRepository.update.mockResolvedValue(mockLead);

    jest.spyOn(mockLead, 'calculatePotential');

    const result = await useCase.execute(createPropertyDto);

    expect(leadRepository.findById).toHaveBeenCalledWith(leadId);
    expect(ruralPropertyRepository.save).toHaveBeenCalled();
    expect(leadRepository.findByIdWithRelations).toHaveBeenCalledWith(leadId);
    expect(mockLead.calculatePotential).toHaveBeenCalled();
    expect(leadRepository.update).toHaveBeenCalledWith(mockLead);
    expect(result).toEqual(mockSavedProperty);
  });

  it('should throw ResourceNotFoundException if lead not found', async () => {
    const leadId = 'lead123';
    const createPropertyDto: CreateRuralPropertyDto = {
      leadId: leadId,
      name: 'New Farm',
      totalAreaHectares: 100,
      productiveAreaHectares: 80,
      city: 'Test City',
      state: 'TS',
      cropProductions: [],
      location: { type: 'Point', coordinates: [20, 10] },
    };

    mockLeadRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(createPropertyDto)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(leadRepository.findById).toHaveBeenCalledWith(leadId);
    expect(ruralPropertyRepository.save).not.toHaveBeenCalled();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import { CreateLeadDto } from '../../../application/dtos/create-lead.dto';
import { CreateRuralPropertyDto } from '../../../application/dtos/create-rural-property.dto';
import { GetLeadsDto } from '../../../application/dtos/get-leads.dto';
import { GetNearbyLeadsDto } from '../../../application/dtos/get-nearby-leads.dto';
import { LeadScoreDto } from '../../../application/dtos/lead-score.dto';
import { LeadDto } from '../../../application/dtos/lead.dto';
import { RuralPropertyDto } from '../../../application/dtos/rural-property.dto';
import { UpdateLeadDto } from '../../../application/dtos/update-lead.dto';
import { AddRuralPropertyUseCase } from '../../../application/use-cases/add-rural-property.use-case';
import { CalculateLeadScoreUseCase } from '../../../application/use-cases/calculate-lead-score.use-case';
import { CreateLeadUseCase } from '../../../application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from '../../../application/use-cases/delete-lead.use-case';
import { FindAllLeadsUseCase } from '../../../application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from '../../../application/use-cases/find-one-lead.use-case';
import { GetNearbyLeadsUseCase } from '../../../application/use-cases/get-nearby-leads.use-case';
import { UpdateLeadUseCase } from '../../../application/use-cases/update-lead.use-case';
import { Lead } from '../../../domain/entities/lead.entity';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { LeadController } from '../lead.controller';

describe('LeadController', () => {
  let controller: LeadController;
  let createLeadUseCase: CreateLeadUseCase;
  let findAllLeadsUseCase: FindAllLeadsUseCase;
  let findOneLeadUseCase: FindOneLeadUseCase;
  let updateLeadUseCase: UpdateLeadUseCase;
  let deleteLeadUseCase: DeleteLeadUseCase;
  let calculateLeadScoreUseCase: CalculateLeadScoreUseCase;
  let getNearbyLeadsUseCase: GetNearbyLeadsUseCase;
  let addRuralPropertyUseCase: AddRuralPropertyUseCase;

  const mockCreateLeadUseCase = { execute: jest.fn() };
  const mockFindAllLeadsUseCase = { execute: jest.fn() };
  const mockFindOneLeadUseCase = { execute: jest.fn() };
  const mockUpdateLeadUseCase = { execute: jest.fn() };
  const mockDeleteLeadUseCase = { execute: jest.fn() };
  const mockCalculateLeadScoreUseCase = { execute: jest.fn() };
  const mockGetNearbyLeadsUseCase = { execute: jest.fn() };
  const mockAddRuralPropertyUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadController],
      providers: [
        { provide: CreateLeadUseCase, useValue: mockCreateLeadUseCase },
        { provide: FindAllLeadsUseCase, useValue: mockFindAllLeadsUseCase },
        { provide: FindOneLeadUseCase, useValue: mockFindOneLeadUseCase },
        { provide: UpdateLeadUseCase, useValue: mockUpdateLeadUseCase },
        { provide: DeleteLeadUseCase, useValue: mockDeleteLeadUseCase },
        {
          provide: CalculateLeadScoreUseCase,
          useValue: mockCalculateLeadScoreUseCase,
        },
        { provide: GetNearbyLeadsUseCase, useValue: mockGetNearbyLeadsUseCase },
        {
          provide: AddRuralPropertyUseCase,
          useValue: mockAddRuralPropertyUseCase,
        },
      ],
    }).compile();

    controller = module.get<LeadController>(LeadController);
    createLeadUseCase = module.get<CreateLeadUseCase>(CreateLeadUseCase);
    findAllLeadsUseCase = module.get<FindAllLeadsUseCase>(FindAllLeadsUseCase);
    findOneLeadUseCase = module.get<FindOneLeadUseCase>(FindOneLeadUseCase);
    updateLeadUseCase = module.get<UpdateLeadUseCase>(UpdateLeadUseCase);
    deleteLeadUseCase = module.get<DeleteLeadUseCase>(DeleteLeadUseCase);
    calculateLeadScoreUseCase = module.get<CalculateLeadScoreUseCase>(
      CalculateLeadScoreUseCase,
    );
    getNearbyLeadsUseCase = module.get<GetNearbyLeadsUseCase>(
      GetNearbyLeadsUseCase,
    );
    addRuralPropertyUseCase = module.get<AddRuralPropertyUseCase>(
      AddRuralPropertyUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a lead', async () => {
      const dto = {
        name: 'Test',
        document: '12345678901',
        phone: '11999999999',
        estimatedPotential: 100,
        status: LeadStatus.NEW,
      } satisfies CreateLeadDto;
      const mockLead = Lead.create({ ...dto });
      mockCreateLeadUseCase.execute.mockResolvedValue(mockLead);

      const result = await controller.create(dto);

      expect(createLeadUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toBeInstanceOf(LeadDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated leads', async () => {
      const query: GetLeadsDto = { page: 1, limit: 10 };
      const mockLeads = [
        Lead.create({
          name: 'Test',
          document: '123',
          phone: '11999999999',
          estimatedPotential: 100,
          status: LeadStatus.NEW,
        }),
      ];
      mockFindAllLeadsUseCase.execute.mockResolvedValue({
        items: mockLeads,
        total: 1,
      });

      const result = await controller.findAll(query);

      expect(findAllLeadsUseCase.execute).toHaveBeenCalledWith(query);
      expect(result.data).toHaveLength(1);
      expect(result.metadata.total).toBe(1);
    });
  });

  describe('findNearby', () => {
    it('should return nearby leads', async () => {
      const query: GetNearbyLeadsDto = {
        lat: 10,
        long: 20,
        range: 100,
      };
      const mockLeads = [
        Lead.create({
          name: 'Nearby Lead',
          document: '999',
          phone: '11999999999',
          estimatedPotential: 500,
          status: LeadStatus.NEW,
        }),
      ];
      mockGetNearbyLeadsUseCase.execute.mockResolvedValue({
        items: mockLeads,
        total: 1,
      });

      const result = await controller.findNearby(query);

      expect(getNearbyLeadsUseCase.execute).toHaveBeenCalledWith(query);
      expect(result.data).toHaveLength(1);
      expect(result.metadata.total).toBe(1);
    });
  });

  describe('calculateScore', () => {
    it('should return lead score', async () => {
      const id = 'some-uuid';
      const expectedScore: LeadScoreDto = {
        id,
        estimatedPotential: 85,
        updatedAt: new Date(),
      };
      mockCalculateLeadScoreUseCase.execute.mockResolvedValue(expectedScore);

      const result = await controller.calculateScore(id);

      expect(calculateLeadScoreUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedScore);
    });
  });

  describe('findOne', () => {
    it('should return a lead by id', async () => {
      const id = 'some-uuid';
      const mockLead = Lead.create({
        name: 'Test',
        document: '123',
        phone: '11999999999',
        estimatedPotential: 100,
        status: LeadStatus.NEW,
      });
      mockFindOneLeadUseCase.execute.mockResolvedValue(mockLead);

      const result = await controller.findOne(id);

      expect(findOneLeadUseCase.execute).toHaveBeenCalledWith(id);
      expect(result).toBeInstanceOf(LeadDto);
      expect(result.name).toBe(mockLead.name);
    });
  });

  describe('update', () => {
    it('should update a lead', async () => {
      const id = 'some-uuid';
      const dto: UpdateLeadDto = { name: 'Updated Name' };
      const mockLead = Lead.create({
        name: 'Updated Name',
        document: '123',
        phone: '11999999999',
        estimatedPotential: 100,
        status: LeadStatus.NEW,
      });
      mockUpdateLeadUseCase.execute.mockResolvedValue(mockLead);

      const result = await controller.update(id, dto);

      expect(updateLeadUseCase.execute).toHaveBeenCalledWith({ id, data: dto });
      expect(result).toBeInstanceOf(LeadDto);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should remove a lead', async () => {
      const id = 'some-uuid';
      mockDeleteLeadUseCase.execute.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(deleteLeadUseCase.execute).toHaveBeenCalledWith(id);
    });
  });

  describe('addProperty', () => {
    it('should add a property to a lead', async () => {
      const id = 'some-uuid';
      const dto = {
        leadId: id,
        name: 'Farm',
        totalAreaHectares: 100,
        productiveAreaHectares: 80,
        city: 'City',
        state: 'ST',
        cropProductions: [],
        location: { type: 'Point', coordinates: [10, 20] },
      } satisfies CreateRuralPropertyDto;

      const mockLeadId = 'some-uuid';
      const mockProperty = RuralProperty.create({
        name: dto.name,
        totalAreaHectares: dto.totalAreaHectares,
        productiveAreaHectares: dto.productiveAreaHectares,
        location: dto.location,
        city: dto.city,
        state: dto.state,
        cropProductions: [],
        leadId: mockLeadId,
      });

      mockAddRuralPropertyUseCase.execute.mockResolvedValue(mockProperty);

      const inputDto = { ...dto };
      const result = await controller.addProperty(id, inputDto);

      expect(addRuralPropertyUseCase.execute).toHaveBeenCalled();
      expect(result).toBeInstanceOf(RuralPropertyDto);
      expect(result.name).toBe(mockProperty.name);
    });
  });
});

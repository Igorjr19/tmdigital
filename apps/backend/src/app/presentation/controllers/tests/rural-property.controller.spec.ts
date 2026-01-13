import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import { RuralPropertyDto } from '../../../application/dtos/rural-property.dto';
import { UpdateRuralPropertyDto } from '../../../application/dtos/update-rural-property.dto';
import { DeleteRuralPropertyUseCase } from '../../../application/use-cases/delete-rural-property.use-case';
import { FindAllRuralPropertiesByLeadUseCase } from '../../../application/use-cases/find-all-rural-properties-by-lead.use-case';
import { FindOneRuralPropertyUseCase } from '../../../application/use-cases/find-one-rural-property.use-case';
import { UpdateRuralPropertyUseCase } from '../../../application/use-cases/update-rural-property.use-case';
import { RuralProperty } from '../../../domain/entities/rural-property.entity';
import { RuralPropertyController } from '../rural-property.controller';

describe('RuralPropertyController', () => {
  let controller: RuralPropertyController;
  let updateUseCase: UpdateRuralPropertyUseCase;
  let deleteUseCase: DeleteRuralPropertyUseCase;

  const mockUpdateUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteUseCase = {
    execute: jest.fn(),
  };

  const mockFindAllUseCase = {
    execute: jest.fn(),
  };

  const mockFindOneUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuralPropertyController],
      providers: [
        {
          provide: UpdateRuralPropertyUseCase,
          useValue: mockUpdateUseCase,
        },
        {
          provide: DeleteRuralPropertyUseCase,
          useValue: mockDeleteUseCase,
        },
        {
          provide: FindAllRuralPropertiesByLeadUseCase,
          useValue: mockFindAllUseCase,
        },
        {
          provide: FindOneRuralPropertyUseCase,
          useValue: mockFindOneUseCase,
        },
      ],
    }).compile();

    controller = module.get<RuralPropertyController>(RuralPropertyController);
    updateUseCase = module.get<UpdateRuralPropertyUseCase>(
      UpdateRuralPropertyUseCase,
    );
    deleteUseCase = module.get<DeleteRuralPropertyUseCase>(
      DeleteRuralPropertyUseCase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update a property and return dto', async () => {
      const id = 'prop1';
      const dto: UpdateRuralPropertyDto = { name: 'New Name' };
      const mockProperty = RuralProperty.create({
        id,
        leadId: 'lead1',
        name: 'New Name',
        totalAreaHectares: 100,
        productiveAreaHectares: 80,
        city: 'Test City',
        state: 'TS',
        location: { type: 'Point', coordinates: [10, 20] },
        cropProductions: [],
      });

      mockUpdateUseCase.execute.mockResolvedValue(mockProperty);

      const result = await controller.update('lead1', id, dto);

      expect(updateUseCase.execute).toHaveBeenCalledWith({
        id,
        leadId: 'lead1',
        data: dto,
      });
      expect(result).toBeInstanceOf(RuralPropertyDto);
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should remove a property', async () => {
      const id = 'prop1';
      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      await controller.remove('lead1', id);

      expect(deleteUseCase.execute).toHaveBeenCalledWith({
        id,
        leadId: 'lead1',
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { ResourceAlreadyExistsException } from '../../../domain/exceptions/resource-already-exists.exception';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { CreateLeadDto } from '../../dtos/create-lead.dto';
import { CreateLeadUseCase } from '../create-lead.use-case';

describe('CreateLeadUseCase', () => {
  let useCase: CreateLeadUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findByDocument: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateLeadUseCase,
          useFactory: (leadRepo: LeadRepository) =>
            new CreateLeadUseCase(leadRepo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateLeadUseCase>(CreateLeadUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new lead successfully', async () => {
    const createLeadDto: CreateLeadDto = {
      name: 'John Doe',
      document: '12345678901',
      estimatedPotential: 10000,
      status: LeadStatus.NEW,
    };

    const createdLead = Lead.create({
      ...createLeadDto,
      status: LeadStatus.NEW,
    });

    mockLeadRepository.findByDocument.mockResolvedValue(null);
    mockLeadRepository.save.mockResolvedValue(createdLead);

    const result = await useCase.execute(createLeadDto);

    expect(leadRepository.findByDocument).toHaveBeenCalledWith(
      createLeadDto.document,
    );
    expect(leadRepository.save).toHaveBeenCalled(); // We can't strictly compare Lead instances here because create generates new ones
    expect(result.name).toBe(createLeadDto.name);
    expect(result.document).toBe(createLeadDto.document);
  });

  it('should throw ResourceAlreadyExistsException if lead already exists', async () => {
    const createLeadDto: CreateLeadDto = {
      name: 'John Doe',
      document: '12345678901',
      estimatedPotential: 10000,
    };

    const existingLead = Lead.create({
      ...createLeadDto,
      status: LeadStatus.NEW,
    });

    mockLeadRepository.findByDocument.mockResolvedValue(existingLead);

    await expect(useCase.execute(createLeadDto)).rejects.toThrow(
      ResourceAlreadyExistsException,
    );
    expect(leadRepository.findByDocument).toHaveBeenCalledWith(
      createLeadDto.document,
    );
    expect(leadRepository.save).not.toHaveBeenCalled();
  });
});

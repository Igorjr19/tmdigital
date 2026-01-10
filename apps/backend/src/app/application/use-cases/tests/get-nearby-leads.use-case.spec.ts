import { Test, TestingModule } from '@nestjs/testing';
import { Lead } from '../../../domain/entities/lead.entity';
import { LeadStatus } from '../../../domain/enums/lead-status.enum';
import { LeadRepository } from '../../../domain/repositories/lead.repository';
import { GetNearbyLeadsDto } from '../../dtos/get-nearby-leads.dto';
import { GetNearbyLeadsUseCase } from '../get-nearby-leads.use-case';

describe('GetNearbyLeadsUseCase', () => {
  let useCase: GetNearbyLeadsUseCase;
  let leadRepository: LeadRepository;

  const mockLeadRepository = {
    findNearby: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GetNearbyLeadsUseCase,
          useFactory: (repo: LeadRepository) => new GetNearbyLeadsUseCase(repo),
          inject: [LeadRepository],
        },
        {
          provide: LeadRepository,
          useFactory: () => mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetNearbyLeadsUseCase>(GetNearbyLeadsUseCase);
    leadRepository = module.get<LeadRepository>(LeadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return nearby leads', async () => {
    const mockLeads = [
      Lead.create({
        name: 'Lead 1',
        document: '111',
        status: LeadStatus.NEW,
        estimatedPotential: 1000,
      }),
    ];

    const mockResponse = {
      items: mockLeads,
      total: 1,
    };

    mockLeadRepository.findNearby.mockResolvedValue(mockResponse);

    const query: GetNearbyLeadsDto = {
      lat: 10,
      long: 20,
      range: 50,
      page: 1,
      limit: 10,
    };

    const result = await useCase.execute(query);

    expect(leadRepository.findNearby).toHaveBeenCalledWith(
      query.lat,
      query.long,
      query.range,
      query,
    );
    expect(result).toEqual(mockResponse);
  });
});

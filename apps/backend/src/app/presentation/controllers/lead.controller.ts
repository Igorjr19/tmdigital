import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeadDto } from '../../application/dtos/create-lead.dto';
import { GetNearbyLeadsDto } from '../../application/dtos/get-nearby-leads.dto';
import { LeadDto } from '../../application/dtos/lead.dto';
import { PaginatedResponseDto } from '../../application/dtos/paginated-response.dto';
import { PaginationDto } from '../../application/dtos/pagination.dto';
import { UpdateLeadDto } from '../../application/dtos/update-lead.dto';
import { CalculateLeadScoreUseCase } from '../../application/use-cases/calculate-lead-score.use-case';
import { CreateLeadUseCase } from '../../application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from '../../application/use-cases/delete-lead.use-case';
import { FindAllLeadsUseCase } from '../../application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from '../../application/use-cases/find-one-lead.use-case';
import { GetNearbyLeadsUseCase } from '../../application/use-cases/get-nearby-leads.use-case';
import { UpdateLeadUseCase } from '../../application/use-cases/update-lead.use-case';
import { ApiDocCreateLead } from '../decorators/api-doc-create-lead.decorator';
import { ApiDocDeleteLead } from '../decorators/api-doc-delete-lead.decorator';
import { ApiDocFindAllLeads } from '../decorators/api-doc-find-all-leads.decorator';
import { ApiDocFindOneLead } from '../decorators/api-doc-find-one-lead.decorator';
import { ApiDocUpdateLead } from '../decorators/api-doc-update-lead.decorator';

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(
    private readonly createLeadUseCase: CreateLeadUseCase,
    private readonly findAllLeadsUseCase: FindAllLeadsUseCase,
    private readonly findOneLeadUseCase: FindOneLeadUseCase,
    private readonly updateLeadUseCase: UpdateLeadUseCase,
    private readonly deleteLeadUseCase: DeleteLeadUseCase,
    private readonly calculateLeadScoreUseCase: CalculateLeadScoreUseCase,
    private readonly getNearbyLeadsUseCase: GetNearbyLeadsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiDocCreateLead()
  async create(@Body() createLeadDto: CreateLeadDto): Promise<LeadDto> {
    const lead = await this.createLeadUseCase.execute(createLeadDto);
    return LeadDto.fromDomain(lead);
  }

  @Get()
  @ApiDocFindAllLeads()
  async findAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponseDto<LeadDto>> {
    const { items, total } = await this.findAllLeadsUseCase.execute(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      data: items.map(LeadDto.fromDomain),
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get('nearby')
  @ApiDocFindAllLeads()
  async findNearby(
    @Query() query: GetNearbyLeadsDto,
  ): Promise<PaginatedResponseDto<LeadDto>> {
    const { items, total } = await this.getNearbyLeadsUseCase.execute(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      data: items.map(LeadDto.fromDomain),
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Post(':id/calculate-score')
  @HttpCode(HttpStatus.OK)
  async calculateScore(@Param('id') id: string): Promise<{ score: number }> {
    const score = await this.calculateLeadScoreUseCase.execute(id);
    return { score };
  }

  @Get(':id')
  @ApiDocFindOneLead()
  async findOne(@Param('id') id: string): Promise<LeadDto> {
    const lead = await this.findOneLeadUseCase.execute(id);
    return LeadDto.fromDomain(lead);
  }

  @Patch(':id')
  @ApiDocUpdateLead()
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ): Promise<LeadDto> {
    const lead = await this.updateLeadUseCase.execute({
      id,
      data: updateLeadDto,
    });
    return LeadDto.fromDomain(lead);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocDeleteLead()
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteLeadUseCase.execute(id);
  }
}

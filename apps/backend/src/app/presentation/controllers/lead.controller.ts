import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeadDto } from '../../application/dtos/create-lead.dto';
import { CreateRuralPropertyDto } from '../../application/dtos/create-rural-property.dto';
import { GetLeadsResponseDto } from '../../application/dtos/get-leads-response.dto';
import { GetLeadsDto } from '../../application/dtos/get-leads.dto';
import { GetNearbyLeadsDto } from '../../application/dtos/get-nearby-leads.dto';
import { LeadScoreDto } from '../../application/dtos/lead-score.dto';
import { LeadDto } from '../../application/dtos/lead.dto';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';
import { UpdateLeadDto } from '../../application/dtos/update-lead.dto';
import { AddRuralPropertyUseCase } from '../../application/use-cases/add-rural-property.use-case';
import { CalculateLeadScoreUseCase } from '../../application/use-cases/calculate-lead-score.use-case';
import { CreateLeadUseCase } from '../../application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from '../../application/use-cases/delete-lead.use-case';
import { FindAllLeadsUseCase } from '../../application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from '../../application/use-cases/find-one-lead.use-case';
import { GetNearbyLeadsUseCase } from '../../application/use-cases/get-nearby-leads.use-case';
import { UpdateLeadUseCase } from '../../application/use-cases/update-lead.use-case';
import { ApiDocCalculateLeadScore } from '../decorators/api-doc-calculate-lead-score.decorator';
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
    private readonly addRuralPropertyUseCase: AddRuralPropertyUseCase,
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
  async findAll(@Query() query: GetLeadsDto): Promise<GetLeadsResponseDto> {
    const { items, total } = await this.findAllLeadsUseCase.execute(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      data: items.map(LeadDto.fromDomain),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get('nearby')
  @ApiDocFindAllLeads()
  async findNearby(
    @Query() query: GetNearbyLeadsDto,
  ): Promise<GetLeadsResponseDto> {
    const { items, total } = await this.getNearbyLeadsUseCase.execute(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      data: items.map(LeadDto.fromDomain),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Post(':id/score')
  @ApiDocCalculateLeadScore()
  async calculateScore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LeadScoreDto> {
    const leadScoreDto = await this.calculateLeadScoreUseCase.execute(id);
    return leadScoreDto;
  }

  @Get(':id')
  @ApiDocFindOneLead()
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<LeadDto> {
    const lead = await this.findOneLeadUseCase.execute(id);
    return LeadDto.fromDomain(lead);
  }

  @Patch(':id')
  @ApiDocUpdateLead()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
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
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteLeadUseCase.execute(id);
  }

  @Post(':id/properties')
  @HttpCode(HttpStatus.CREATED)
  async addProperty(
    @Param('id') id: string,
    @Body() createRuralPropertyDto: CreateRuralPropertyDto,
  ): Promise<RuralPropertyDto> {
    createRuralPropertyDto.leadId = id;
    const property = await this.addRuralPropertyUseCase.execute(
      createRuralPropertyDto,
    );
    return RuralPropertyDto.fromDomain(property);
  }
}

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
} from '@nestjs/common';
import { CreateLeadDto } from '../../application/dtos/create-lead.dto';
import { LeadDto } from '../../application/dtos/lead.dto';
import { UpdateLeadDto } from '../../application/dtos/update-lead.dto';
import { CreateLeadUseCase } from '../../application/use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from '../../application/use-cases/delete-lead.use-case';
import { FindAllLeadsUseCase } from '../../application/use-cases/find-all-leads.use-case';
import { FindOneLeadUseCase } from '../../application/use-cases/find-one-lead.use-case';
import { UpdateLeadUseCase } from '../../application/use-cases/update-lead.use-case';

@Controller('leads')
export class LeadController {
  constructor(
    private readonly createLeadUseCase: CreateLeadUseCase,
    private readonly findAllLeadsUseCase: FindAllLeadsUseCase,
    private readonly findOneLeadUseCase: FindOneLeadUseCase,
    private readonly updateLeadUseCase: UpdateLeadUseCase,
    private readonly deleteLeadUseCase: DeleteLeadUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadDto: CreateLeadDto): Promise<LeadDto> {
    const lead = await this.createLeadUseCase.execute(createLeadDto);
    return LeadDto.fromDomain(lead);
  }

  @Get()
  async findAll(): Promise<LeadDto[]> {
    const leads = await this.findAllLeadsUseCase.execute();
    return leads.map(LeadDto.fromDomain);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LeadDto> {
    const lead = await this.findOneLeadUseCase.execute(id);
    return LeadDto.fromDomain(lead);
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteLeadUseCase.execute(id);
  }
}

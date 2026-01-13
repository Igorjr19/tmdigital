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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';
import { UpdateRuralPropertyDto } from '../../application/dtos/update-rural-property.dto';
import { DeleteRuralPropertyUseCase } from '../../application/use-cases/delete-rural-property.use-case';
import { FindAllRuralPropertiesByLeadUseCase } from '../../application/use-cases/find-all-rural-properties-by-lead.use-case';
import { FindOneRuralPropertyUseCase } from '../../application/use-cases/find-one-rural-property.use-case';
import { UpdateRuralPropertyUseCase } from '../../application/use-cases/update-rural-property.use-case';
import { ApiDocDeleteRuralProperty } from '../decorators/api-doc-delete-rural-property.decorator';
import { ApiDocFindAllRuralProperties } from '../decorators/api-doc-find-all-rural-properties.decorator';
import { ApiDocFindOneRuralProperty } from '../decorators/api-doc-find-one-rural-property.decorator';
import { ApiDocUpdateRuralProperty } from '../decorators/api-doc-update-rural-property.decorator';

@ApiTags('Rural Properties')
@Controller('leads/:leadId/properties')
export class RuralPropertyController {
  constructor(
    private readonly updateRuralPropertyUseCase: UpdateRuralPropertyUseCase,
    private readonly deleteRuralPropertyUseCase: DeleteRuralPropertyUseCase,
    private readonly findAllRuralPropertiesByLeadUseCase: FindAllRuralPropertiesByLeadUseCase,
    private readonly findOneRuralPropertyUseCase: FindOneRuralPropertyUseCase,
  ) {}

  @Get()
  @ApiDocFindAllRuralProperties()
  async findAll(@Param('leadId') leadId: string): Promise<RuralPropertyDto[]> {
    const properties =
      await this.findAllRuralPropertiesByLeadUseCase.execute(leadId);
    return properties.map(RuralPropertyDto.fromDomain);
  }

  @Get(':id')
  @ApiDocFindOneRuralProperty()
  async findOne(
    @Param('leadId') leadId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RuralPropertyDto> {
    const property = await this.findOneRuralPropertyUseCase.execute({
      leadId,
      propertyId: id,
    });
    return RuralPropertyDto.fromDomain(property);
  }

  @Patch(':id')
  @ApiDocUpdateRuralProperty()
  async update(
    @Param('leadId') leadId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRuralPropertyDto: UpdateRuralPropertyDto,
  ): Promise<RuralPropertyDto> {
    const property = await this.updateRuralPropertyUseCase.execute({
      id,
      leadId,
      data: updateRuralPropertyDto,
    });
    return RuralPropertyDto.fromDomain(property);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDocDeleteRuralProperty()
  async remove(
    @Param('leadId') leadId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.deleteRuralPropertyUseCase.execute({ id, leadId });
  }
}

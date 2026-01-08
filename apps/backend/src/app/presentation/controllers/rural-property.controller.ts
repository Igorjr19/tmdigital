import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RuralPropertyDto } from '../../application/dtos/rural-property.dto';
import { UpdateRuralPropertyDto } from '../../application/dtos/update-rural-property.dto';
import { DeleteRuralPropertyUseCase } from '../../application/use-cases/delete-rural-property.use-case';
import { UpdateRuralPropertyUseCase } from '../../application/use-cases/update-rural-property.use-case';

@ApiTags('Rural Properties')
@Controller('properties')
export class RuralPropertyController {
  constructor(
    private readonly updateRuralPropertyUseCase: UpdateRuralPropertyUseCase,
    private readonly deleteRuralPropertyUseCase: DeleteRuralPropertyUseCase,
  ) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRuralPropertyDto: UpdateRuralPropertyDto,
  ): Promise<RuralPropertyDto> {
    const property = await this.updateRuralPropertyUseCase.execute({
      id,
      data: updateRuralPropertyDto,
    });
    return RuralPropertyDto.fromDomain(property);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteRuralPropertyUseCase.execute(id);
  }
}

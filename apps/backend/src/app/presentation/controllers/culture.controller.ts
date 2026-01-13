import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CultureDto } from '../../application/dtos/culture.dto';
import { GetCulturesUseCase } from '../../application/use-cases/get-cultures.use-case';
import { ApiDocGetCultures } from '../decorators/api-doc-get-cultures.decorator';

@ApiTags('Cultures')
@Controller('cultures')
export class CultureController {
  constructor(private readonly getCulturesUseCase: GetCulturesUseCase) {}

  @Get()
  @Get()
  @ApiDocGetCultures()
  async findAll(): Promise<CultureDto[]> {
    const cultures = await this.getCulturesUseCase.execute();
    return cultures.map(CultureDto.fromDomain);
  }
}

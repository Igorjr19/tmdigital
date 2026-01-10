import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CultureDto } from '../../application/dtos/culture.dto';
import { GetCulturesUseCase } from '../../application/use-cases/get-cultures.use-case';

@ApiTags('Cultures')
@Controller('cultures')
export class CultureController {
  constructor(private readonly getCulturesUseCase: GetCulturesUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'Lista todas as culturas disponíveis',
    type: [CultureDto],
  })
  async findAll(): Promise<CultureDto[]> {
    const cultures = await this.getCulturesUseCase.execute();
    return cultures.map(CultureDto.fromDomain);
  }
}

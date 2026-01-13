import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DashboardForecastDto,
  DashboardGeoStatsDto,
  DashboardMarketShareDto,
  DashboardPlantingAlertDto,
  DashboardStaleLeadDto,
} from '../../application/dtos/dashboard.dto';
import { GetForecastUseCase } from '../../application/use-cases/dashboard/get-forecast.use-case';
import { GetGeoStatsUseCase } from '../../application/use-cases/dashboard/get-geo-stats.use-case';
import { GetMarketShareUseCase } from '../../application/use-cases/dashboard/get-market-share.use-case';
import { GetPlantingAlertsUseCase } from '../../application/use-cases/dashboard/get-planting-alerts.use-case';
import { GetStaleLeadsUseCase } from '../../application/use-cases/dashboard/get-stale-leads.use-case';
import {
  ApiDocGetForecast,
  ApiDocGetGeoStats,
  ApiDocGetMarketShare,
  ApiDocGetPlantingAlerts,
  ApiDocGetStaleLeads,
} from '../decorators/api-doc-dashboard.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getStaleLeadsUseCase: GetStaleLeadsUseCase,
    private readonly getPlantingAlertsUseCase: GetPlantingAlertsUseCase,
    private readonly getGeoStatsUseCase: GetGeoStatsUseCase,
    private readonly getMarketShareUseCase: GetMarketShareUseCase,
    private readonly getForecastUseCase: GetForecastUseCase,
  ) {}

  @Get('stale-leads')
  @ApiDocGetStaleLeads()
  getStaleLeads(): Promise<DashboardStaleLeadDto[]> {
    return this.getStaleLeadsUseCase.execute();
  }

  @Get('planting-alerts')
  @ApiDocGetPlantingAlerts()
  getPlantingAlerts(): Promise<DashboardPlantingAlertDto[]> {
    return this.getPlantingAlertsUseCase.execute();
  }

  @Get('geo-stats')
  @ApiDocGetGeoStats()
  getGeoStats(): Promise<DashboardGeoStatsDto> {
    return this.getGeoStatsUseCase.execute();
  }

  @Get('market-share')
  @ApiDocGetMarketShare()
  getMarketShare(): Promise<DashboardMarketShareDto[]> {
    return this.getMarketShareUseCase.execute();
  }

  @Get('forecast')
  @ApiDocGetForecast()
  getForecast(): Promise<DashboardForecastDto> {
    return this.getForecastUseCase.execute();
  }
}

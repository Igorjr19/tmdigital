import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  DashboardForecastDto,
  DashboardGeoStatsDto,
  DashboardMarketShareDto,
  DashboardPlantingAlertDto,
  DashboardStaleLeadDto,
} from '../../application/dtos/dashboard.dto';

export function ApiDocGetStaleLeads() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get stale leads',
      description: 'Retrieve leads with no activity for more than 15 days.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of stale leads returned successfully.',
      type: [DashboardStaleLeadDto],
    }),
  );
}

export function ApiDocGetPlantingAlerts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get planting alerts',
      description:
        'Retrieve active planting alerts for cultures based on the current month.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of planting alerts returned successfully.',
      type: [DashboardPlantingAlertDto],
    }),
  );
}

export function ApiDocGetGeoStats() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get geographic stats',
      description:
        'Retrieve geographic statistics including total area, converted area, and heatmap data.',
    }),
    ApiResponse({
      status: 200,
      description: 'Geographic statistics returned successfully.',
      type: DashboardGeoStatsDto,
    }),
  );
}

export function ApiDocGetMarketShare() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get market share',
      description: 'Retrieve market share distribution by supplier.',
    }),
    ApiResponse({
      status: 200,
      description: 'Market share data returned successfully.',
      type: [DashboardMarketShareDto],
    }),
  );
}

export function ApiDocGetForecast() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get forecast',
      description: 'Retrieve weighted sales forecast based on lead status.',
    }),
    ApiResponse({
      status: 200,
      description: 'Forecast data returned successfully.',
      type: DashboardForecastDto,
    }),
  );
}

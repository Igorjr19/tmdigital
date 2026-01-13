import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { GetForecastUseCase } from '../src/app/application/use-cases/dashboard/get-forecast.use-case';
import { GetGeoStatsUseCase } from '../src/app/application/use-cases/dashboard/get-geo-stats.use-case';
import { GetMarketShareUseCase } from '../src/app/application/use-cases/dashboard/get-market-share.use-case';
import { GetPlantingAlertsUseCase } from '../src/app/application/use-cases/dashboard/get-planting-alerts.use-case';
import { GetStaleLeadsUseCase } from '../src/app/application/use-cases/dashboard/get-stale-leads.use-case';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;

  const mockStaleLeads = [{ id: '1', name: 'Stale Lead' }];
  const mockPlantingAlerts = [{ culture: 'Soja', alertMessage: 'Plant now' }];
  const mockGeoStats = { totalAreaRegistered: 1000, heatmap: [] };
  const mockMarketShare = [{ supplier: 'Bayer', sharePercentage: 50 }];
  const mockForecast = { totalPotential: 1000, weightedForecast: 500 };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GetStaleLeadsUseCase)
      .useValue({ execute: jest.fn().mockResolvedValue(mockStaleLeads) })
      .overrideProvider(GetPlantingAlertsUseCase)
      .useValue({ execute: jest.fn().mockResolvedValue(mockPlantingAlerts) })
      .overrideProvider(GetGeoStatsUseCase)
      .useValue({ execute: jest.fn().mockResolvedValue(mockGeoStats) })
      .overrideProvider(GetMarketShareUseCase)
      .useValue({ execute: jest.fn().mockResolvedValue(mockMarketShare) })
      .overrideProvider(GetForecastUseCase)
      .useValue({ execute: jest.fn().mockResolvedValue(mockForecast) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/dashboard/stale-leads (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard/stale-leads')
      .expect(200)
      .expect(mockStaleLeads);
  });

  it('/dashboard/planting-alerts (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard/planting-alerts')
      .expect(200)
      .expect(mockPlantingAlerts);
  });

  it('/dashboard/geo-stats (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard/geo-stats')
      .expect(200)
      .expect(mockGeoStats);
  });

  it('/dashboard/market-share (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard/market-share')
      .expect(200)
      .expect(mockMarketShare);
  });

  it('/dashboard/forecast (GET)', () => {
    return request(app.getHttpServer())
      .get('/dashboard/forecast')
      .expect(200)
      .expect(mockForecast);
  });
});

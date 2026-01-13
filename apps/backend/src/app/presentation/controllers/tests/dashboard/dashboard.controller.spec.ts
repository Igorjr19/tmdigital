import { Test, TestingModule } from '@nestjs/testing';
import {
  DashboardForecastDto,
  DashboardGeoStatsDto,
  DashboardMarketShareDto,
  DashboardPlantingAlertDto,
  DashboardStaleLeadDto,
} from '../../../../application/dtos/dashboard.dto';
import { GetForecastUseCase } from '../../../../application/use-cases/dashboard/get-forecast.use-case';
import { GetGeoStatsUseCase } from '../../../../application/use-cases/dashboard/get-geo-stats.use-case';
import { GetMarketShareUseCase } from '../../../../application/use-cases/dashboard/get-market-share.use-case';
import { GetPlantingAlertsUseCase } from '../../../../application/use-cases/dashboard/get-planting-alerts.use-case';
import { GetStaleLeadsUseCase } from '../../../../application/use-cases/dashboard/get-stale-leads.use-case';
import { DashboardController } from '../../dashboard.controller';

describe('DashboardController', () => {
  let controller: DashboardController;
  let getStaleLeadsUseCase: GetStaleLeadsUseCase;
  let getPlantingAlertsUseCase: GetPlantingAlertsUseCase;
  let getGeoStatsUseCase: GetGeoStatsUseCase;
  let getMarketShareUseCase: GetMarketShareUseCase;
  let getForecastUseCase: GetForecastUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: GetStaleLeadsUseCase,
          useValue: { execute: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: GetPlantingAlertsUseCase,
          useValue: { execute: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: GetGeoStatsUseCase,
          useValue: { execute: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: GetMarketShareUseCase,
          useValue: { execute: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: GetForecastUseCase,
          useValue: { execute: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    getStaleLeadsUseCase =
      module.get<GetStaleLeadsUseCase>(GetStaleLeadsUseCase);
    getPlantingAlertsUseCase = module.get<GetPlantingAlertsUseCase>(
      GetPlantingAlertsUseCase,
    );
    getGeoStatsUseCase = module.get<GetGeoStatsUseCase>(GetGeoStatsUseCase);
    getMarketShareUseCase = module.get<GetMarketShareUseCase>(
      GetMarketShareUseCase,
    );
    getForecastUseCase = module.get<GetForecastUseCase>(GetForecastUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStaleLeads', () => {
    it('should return stale leads', async () => {
      const mockResult: DashboardStaleLeadDto[] = [];
      jest.spyOn(getStaleLeadsUseCase, 'execute').mockResolvedValue(mockResult);

      expect(await controller.getStaleLeads()).toBe(mockResult);
      expect(getStaleLeadsUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getPlantingAlerts', () => {
    it('should return planting alerts', async () => {
      const mockResult: DashboardPlantingAlertDto[] = [];
      jest
        .spyOn(getPlantingAlertsUseCase, 'execute')
        .mockResolvedValue(mockResult);

      expect(await controller.getPlantingAlerts()).toBe(mockResult);
      expect(getPlantingAlertsUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getGeoStats', () => {
    it('should return geo stats', async () => {
      const mockResult: DashboardGeoStatsDto = {
        totalAreaRegistered: 0,
        totalAreaConverted: 0,
        penetrationPercentage: 0,
        heatmap: [],
      };
      jest.spyOn(getGeoStatsUseCase, 'execute').mockResolvedValue(mockResult);

      expect(await controller.getGeoStats()).toBe(mockResult);
      expect(getGeoStatsUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getMarketShare', () => {
    it('should return market share', async () => {
      const mockResult: DashboardMarketShareDto[] = [];
      jest
        .spyOn(getMarketShareUseCase, 'execute')
        .mockResolvedValue(mockResult);

      expect(await controller.getMarketShare()).toBe(mockResult);
      expect(getMarketShareUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getForecast', () => {
    it('should return forecast', async () => {
      const mockResult: DashboardForecastDto = {
        totalPotential: 0,
        weightedForecast: 0,
      };
      jest.spyOn(getForecastUseCase, 'execute').mockResolvedValue(mockResult);

      expect(await controller.getForecast()).toBe(mockResult);
      expect(getForecastUseCase.execute).toHaveBeenCalled();
    });
  });
});

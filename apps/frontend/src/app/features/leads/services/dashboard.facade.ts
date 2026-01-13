import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DashboardService } from '../../../api/api/dashboard.service';
import {
  DashboardForecastDto,
  DashboardGeoStatsDto,
  DashboardMarketShareDto,
  DashboardPlantingAlertDto,
  DashboardStaleLeadDto,
} from '../../../api/model/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacadeService {
  private dashboardService = inject(DashboardService);

  loading = signal<boolean>(false);
  forecast = signal<DashboardForecastDto | null>(null);
  geoStats = signal<DashboardGeoStatsDto | null>(null);
  marketShare = signal<DashboardMarketShareDto[]>([]);
  plantingAlerts = signal<DashboardPlantingAlertDto[]>([]);
  staleLeads = signal<DashboardStaleLeadDto[]>([]);

  loadMetrics() {
    this.loading.set(true);

    forkJoin({
      forecast: this.dashboardService.dashboardControllerGetForecast(),
      geoStats: this.dashboardService.dashboardControllerGetGeoStats(),
      marketShare: this.dashboardService.dashboardControllerGetMarketShare(),
      plantingAlerts:
        this.dashboardService.dashboardControllerGetPlantingAlerts(),
      staleLeads: this.dashboardService.dashboardControllerGetStaleLeads(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (results) => {
          this.forecast.set(results.forecast);
          this.geoStats.set(results.geoStats);
          this.marketShare.set(results.marketShare);
          this.plantingAlerts.set(results.plantingAlerts);
          this.staleLeads.set(results.staleLeads);
        },
        error: (err) => console.error('Error loading dashboard metrics', err),
      });
  }
}

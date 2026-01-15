import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { I18N } from '../../../core/i18n/i18n';
import { HeatmapViewComponent } from '../components/heatmap-view/heatmap-view.component';
import { DashboardFacadeService } from '../services/dashboard.facade';
import { LeadsFacadeService } from '../services/leads.facade';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, HeatmapViewComponent, TagModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly I18N = I18N;
  private leadsFacade = inject(LeadsFacadeService);
  private dashboardFacade = inject(DashboardFacadeService);

  metrics = this.leadsFacade.metrics;
  staleLeads = this.dashboardFacade.staleLeads;
  plantingAlerts = this.dashboardFacade.plantingAlerts;
  geoStats = this.dashboardFacade.geoStats;

  heatmapData = computed(() => {
    return this.geoStats()?.heatmap || [];
  });

  pieData = computed(() => {
    const marketShare = this.dashboardFacade.marketShare();
    if (!marketShare.length) return null;

    return {
      labels: marketShare.map((m) => m.supplier || 'N/A'),
      datasets: [
        {
          data: marketShare.map((m) => m.sharePercentage),
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#EF5350',
            '#AB47BC',
          ],
        },
      ],
    };
  });

  barData = computed(() => {
    const forecast = this.dashboardFacade.forecast();
    if (!forecast || !forecast.countByStatus) return null;

    const statuses = Object.keys(forecast.countByStatus);
    const counts = Object.values(forecast.countByStatus);

    return {
      labels: statuses.map(
        (s) =>
          this.I18N.LEAD.STATUS[s as keyof typeof this.I18N.LEAD.STATUS] || s,
      ),
      datasets: [
        {
          label: I18N.DASHBOARD.KPI.TOTAL_LEADS,
          backgroundColor: '#42A5F5',
          data: counts,
        },
      ],
    };
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  getDaysInactive(dateStr: string): number {
    const lastUpdate = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  ngOnInit() {
    this.leadsFacade.loadAllLeadsForDashboard();
    this.dashboardFacade.loadMetrics();
  }
}

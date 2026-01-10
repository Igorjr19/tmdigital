import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LeadsFacadeService } from '../services/leads.facade';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private leadsFacade = inject(LeadsFacadeService);

  metrics = this.leadsFacade.metrics;

  pieData = computed(() => {
    const data = this.leadsFacade.leadsByStatus();
    return {
      labels: data.labels,
      datasets: [
        {
          data: data.data,
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#EF5350',
            '#AB47BC',
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#E57373',
            '#BA68C8',
          ],
        },
      ],
    };
  });

  barData = computed(() => {
    const data = this.leadsFacade.areaByCity();
    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Área (ha)',
          backgroundColor: '#42A5F5',
          data: data.data,
        },
      ],
    };
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  ngOnInit() {
    this.leadsFacade.loadAllLeadsForDashboard();
  }
}

import { Route } from '@angular/router';
import { MapViewComponent } from './features/leads/components/map-view/map-view.component';
import { DashboardComponent } from './features/leads/dashboard/dashboard.component';
import { leadRoutes } from './features/leads/leads.routes';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'leads',
  },

  {
    path: 'leads',
    loadChildren: () => leadRoutes,
  },
  {
    path: 'dashboard',
    loadComponent: () => DashboardComponent,
  },
  {
    path: 'map',
    loadComponent: () => MapViewComponent,
  },
];

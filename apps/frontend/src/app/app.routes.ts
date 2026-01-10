import { Route } from '@angular/router';
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
    loadComponent: () =>
      import('./features/leads/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./features/leads/components/map-view/map-view.component').then(
        (m) => m.MapViewComponent,
      ),
  },
];

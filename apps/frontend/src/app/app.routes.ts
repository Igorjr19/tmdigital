import { Route } from '@angular/router';
import { LeadFormComponent } from './features/leads/lead-form/lead-form.component';
import { LeadListComponent } from './features/leads/lead-list/lead-list.component';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'leads',
        pathMatch: 'full',
      },
      {
        path: 'leads',
        component: LeadListComponent,
      },
      {
        path: 'leads/new',
        component: LeadFormComponent,
      },
      {
        path: 'leads/:id',
        component: LeadFormComponent,
      },
    ],
  },
];

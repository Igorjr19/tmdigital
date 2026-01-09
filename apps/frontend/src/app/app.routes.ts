import { Route } from '@angular/router';
import { LeadFormComponent } from './features/leads/lead-form/lead-form.component';
import { LeadListComponent } from './features/leads/lead-list/lead-list.component';

export const appRoutes: Route[] = [
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
];

import { Routes } from '@angular/router';
import { LeadFormComponent } from './lead-form/lead-form.component';
import { LeadListComponent } from './lead-list/lead-list.component';

export const leadRoutes: Routes = [
  {
    path: '',
    component: LeadListComponent,
  },
  {
    path: 'new',
    component: LeadFormComponent,
  },
  {
    path: ':id',
    component: LeadFormComponent,
  },
];

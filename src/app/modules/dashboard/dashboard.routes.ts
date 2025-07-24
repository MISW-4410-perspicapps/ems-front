import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes/dashboard/dashboard.component').then(c => c.DashboardComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

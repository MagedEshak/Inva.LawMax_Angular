import { RoutesService, eLayoutType } from '@abp/ng.core';
import { inject, provideAppInitializer } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

function configureRoutes() {
  const routes = inject(RoutesService);
  routes.add([
    {
      path: '/',
      name: '::Menu:Home',
      iconClass: 'fas fa-home',
      order: 1,
      layout: eLayoutType.application,
    },
    {
      path: 'case',
      name: 'Cases',
      iconClass: 'fas fa-list',
      layout: eLayoutType.application,
    },
    {
      path: 'lawyer',
      name: 'Lawyers',
      iconClass: 'fas fa-user',
      layout: eLayoutType.application,
    //  requiredPolicy: 'LawCases.Lawyer.List',
    },
    {
      path: 'hearing',
      name: 'Hearing',
      iconClass: 'fas fa-clipboard-list',
      layout: eLayoutType.application,
    },
  ]);
}

import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CaseByMonthDto, CaseStatusNumberDto } from '../dtos/dashboard/models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiName = 'Default';
  

  getListOfCaseByMonth = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CaseByMonthDto[]>({
      method: 'GET',
      url: '/api/Dashboard/CaseByMonth',
    },
    { apiName: this.apiName,...config });
  

  getListOfCaseStatusNumber = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CaseStatusNumberDto[]>({
      method: 'GET',
      url: '/api/Dashboard/CaseStatusNumber',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

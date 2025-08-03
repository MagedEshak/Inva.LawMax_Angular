import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateLawyerDto, LawyerDto } from '../../../dtos/lawyer/models';
import type { LawyerWithNavigationPropertyDto } from '../dtos/lawyer/models';

@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  apiName = 'Default';
  

  checkEmail = (email: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'GET',
      url: '/api/Lawyer/check-email',
      params: { email },
    },
    { apiName: this.apiName,...config });
  

  checkPhone = (phone: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'GET',
      url: '/api/Lawyer/check-phone',
      params: { phone },
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateLawyerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LawyerDto>({
      method: 'POST',
      url: '/api/Lawyer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/Lawyer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, date?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LawyerWithNavigationPropertyDto>({
      method: 'GET',
      url: `/api/Lawyer/${id}`,
      params: { date },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LawyerWithNavigationPropertyDto>>({
      method: 'GET',
      url: '/api/Lawyer/all',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLawyerDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LawyerDto>({
      method: 'PATCH',
      url: `/api/Lawyer/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

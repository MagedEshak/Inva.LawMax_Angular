import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CaseDto, CaseLawyerHearingsWithNavigationProperty, CreateUpdateCaseDto } from '../dtos/case/models';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  apiName = 'Default';
  

  createCase = (caseDto: CreateUpdateCaseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CaseDto>({
      method: 'POST',
      url: '/api/Case',
      body: caseDto,
    },
    { apiName: this.apiName,...config });
  

  deleteCase = (caseGuid: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: `/api/Case/${caseGuid}`,
    },
    { apiName: this.apiName,...config });
  

  getCaseById = (caseGuid: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CaseDto>({
      method: 'GET',
      url: `/api/Case/CaseById/${caseGuid}`,
    },
    { apiName: this.apiName,...config });
  

  getCaseWithLawyersAndHearingsById = (caseGuid: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CaseLawyerHearingsWithNavigationProperty>({
      method: 'GET',
      url: `/api/Case/CaseWithLawyersAndHearings/${caseGuid}`,
    },
    { apiName: this.apiName,...config });
  

  getCaseWithLawyersAndHearingsList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CaseLawyerHearingsWithNavigationProperty>>({
      method: 'GET',
      url: '/api/Case/GetCaseWithLawyers',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, date: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CaseDto>>({
      method: 'GET',
      url: '/api/Case/Cases',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount, date },
    },
    { apiName: this.apiName,...config });
  

  updateCase = (id: string, caseDto: CreateUpdateCaseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CaseDto>({
      method: 'PATCH',
      url: `/api/Case/${id}`,
      body: caseDto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

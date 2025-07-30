import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateHearingDto, HearingDto, HearingWithNavigationPropertyDto } from '../dtos/hearing/models';

@Injectable({
  providedIn: 'root',
})
export class HearingService {
  apiName = 'Default';
  

  createHearing = (hearingDto: CreateUpdateHearingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HearingDto>({
      method: 'POST',
      url: '/api/Hearing',
      body: hearingDto,
    },
    { apiName: this.apiName,...config });
  

  deleteHearing = (hearingGuid: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: `/api/Hearing/${hearingGuid}`,
    },
    { apiName: this.apiName,...config });
  

  getHearingById = (hearingGuid: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HearingWithNavigationPropertyDto>({
      method: 'GET',
      url: `/api/Hearing/${hearingGuid}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<HearingWithNavigationPropertyDto>>({
      method: 'GET',
      url: '/api/Hearing/all',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updateHearing = (id: string, hearingDto: CreateUpdateHearingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HearingDto>({
      method: 'PATCH',
      url: `/api/Hearing/${id}`,
      body: hearingDto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}

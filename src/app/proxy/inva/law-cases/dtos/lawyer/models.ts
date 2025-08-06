import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { LawyerDto } from '../../../../dtos/lawyer/models';
import type { CaseDto } from '../case/models';

export interface GetLawyerFilterDto extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface LawyerWithNavigationPropertyDto {
  lawyer: LawyerDto;
  cases: CaseDto[];
}

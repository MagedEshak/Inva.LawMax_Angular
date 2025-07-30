import type { CaseDto } from '../case/models';

export interface HearingDto {
  id?: string;
  date?: string;
  location?: string;
  caseId?: string;
  concurrencyStamp?: string;
}

export interface CreateUpdateHearingDto {
  date?: string;
  location?: string;
  caseId?: string;
  concurrencyStamp?: string;
}

export interface HearingWithNavigationPropertyDto {
  hearing: HearingDto;
  case: CaseDto;
}

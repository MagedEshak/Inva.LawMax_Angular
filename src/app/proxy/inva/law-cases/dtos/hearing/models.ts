import type { Status } from '../../enums/status.enum';
import type { CaseDto } from '../case/models';

export interface HearingDto {
  id?: string;
  date?: string;
  location?: string;
  decision?: string;
  caseId?: string;
  caseTitle?: string;
  caseDescription?: string;
  caseLitigationDegree?: string;
  caseFinalVerdict?: string;
  caseStatus?: Status;
  concurrencyStamp?: string;
}

export interface CreateUpdateHearingDto {
  date?: string;
  location?: string;
  decision?: string;
  caseId?: string;
  concurrencyStamp?: string;
}

export interface HearingWithNavigationPropertyDto {
  hearing: HearingDto;
  case: CaseDto;
}

import type { Status } from '../../enums/status.enum';
import type { HearingDto } from '../hearing/models';
import type { LawyerDto } from '../../../../dtos/lawyer/models';

export interface CaseDto {
  id?: string;
  number?: string;
  caseTitle?: string;
  description?: string;
  litigationDegree?: string;
  finalVerdict?: string;
  status?: Status;
  year: number;
  lawyerID?: string;
  lawyerName?: string;
  lawyerSpeciality?: string;
  creationTime?: string;
  concurrencyStamp?: string;
  hearingDtos: HearingDto[];
}

export interface CaseLawyerHearingsWithNavigationProperty {
  caseDto: CaseDto;
  lawyerDto: LawyerDto;
  hearingDtos: HearingDto[];
}

export interface CreateUpdateCaseDto {
  number?: string;
  caseTitle?: string;
  description?: string;
  litigationDegree?: string;
  finalVerdict?: string;
  status?: Status;
  year: number;
  lawyerId?: string;
  concurrencyStamp?: string;
  hearingDtos: HearingDto[];
}

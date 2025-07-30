import type { Status } from '../../enums/status.enum';
import type { LawyerDto } from '../../../../dtos/lawyer/models';
import type { HearingDto } from '../hearing/models';

export interface CaseDto {
  id?: string;
  title?: string;
  description?: string;
  status?: Status;
  lawyerName?: string;
  lawyerSpeciality?: string;
  hearingDate?: string;
  hearingLocation?: string;
  creationTime?: string;
  concurrencyStamp?: string;
}

export interface CaseLawyerHearingsWithNavigationProperty {
  caseDto: CaseDto;
  lawyerDto: LawyerDto;
  hearingDto: HearingDto;
}

export interface CreateUpdateCaseDto {
  title?: string;
  description?: string;
  status?: Status;
  lawyerId?: string;
  hearingId?: string;
  tenantId?: string;
  concurrencyStamp?: string;
}

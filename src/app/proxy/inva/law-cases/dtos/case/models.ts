import type { Status } from '../../enums/status.enum';

export interface CaseDto {
  id?: string;
  title?: string;
  description?: string;
  status?: Status;
  lawyerId?: string;
  lawyerName?: string;
  lawyerEmail?: string;
  lawyerPhone?: string;
  lawyerSpeciality?: string;
  hearingId?: string;
  hearingDate?: string;
  hearingLocation?: string;
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

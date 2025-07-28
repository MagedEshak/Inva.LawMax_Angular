
export interface CreateUpdateHearingDto {
  date?: string;
  location?: string;
  caseId?: string;
  concurrencyStamp?: string;
}

export interface HearingDto {
  id?: string;
  date?: string;
  location?: string;
  caseId?: string;
}

import type { Status } from '../../enums/status.enum';

export interface CaseByMonthDto {
  month: number;
  couunt: number;
}

export interface CaseStatusNumberDto {
  status?: Status;
  couunt: number;
}

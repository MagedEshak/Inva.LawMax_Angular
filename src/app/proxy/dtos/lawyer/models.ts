import type { CaseDto } from '../../inva/law-cases/dtos/case/models';

export interface LawyerDto {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  speciality?: string;
  cases: CaseDto[];
  concurrencyStamp?: string;
}

export interface CreateUpdateLawyerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  speciality?: string;
  cases: CaseDto[];
  concurrencyStamp?: string;
}

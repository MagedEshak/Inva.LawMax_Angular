
export interface CreateUpdateLawyerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  speciality?: string;
  caseId?: string;
  concurrencyStamp?: string;
}

export interface LawyerDto {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  speciality?: string;
  caseId?: string;
}

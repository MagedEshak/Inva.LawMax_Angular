import type { LawyerDto } from '../../../../dtos/lawyer/models';
import type { CaseDto } from '../case/models';

export interface LawyerWithNavigationPropertyDto {
  lawyer: LawyerDto;
  case: CaseDto;
}

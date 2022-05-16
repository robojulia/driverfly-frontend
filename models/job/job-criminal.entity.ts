import { CriminalHistoryType } from '../../enums/users/criminal-history-type.enum';

export interface JobCriminalEntity {
  type?: CriminalHistoryType;
  max_years?: number;
  max_count?: number;
}

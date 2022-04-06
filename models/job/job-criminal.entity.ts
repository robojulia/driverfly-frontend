import { CriminalHistoryType } from '../../enums/drivers/criminal-history-type.enum';

export interface JobCriminalEntity {
  type?: CriminalHistoryType;
  max_years?: number;
  max_count?: number;
}

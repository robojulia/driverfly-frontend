import { MvrType } from '../../enums/users/mvr-type.enum';

export interface JobMvrEntity {
  type?: MvrType;
  max_count?: number;
  max_years?: number;
}

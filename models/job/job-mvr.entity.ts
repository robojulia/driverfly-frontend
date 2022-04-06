import { MvrType } from '../../enums/drivers/mvr-type.enum';

export interface JobMvrEntity {
  type?: MvrType;
  max_count?: number;
  max_years?: number;
}

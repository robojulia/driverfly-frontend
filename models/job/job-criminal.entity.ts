import { CriminalHistoryType } from '../../enums/users/criminal-history-type.enum';
import * as yup from "yup";

export class JobCriminalEntity {
  type?: CriminalHistoryType;
  max_years?: number;
  max_count?: number;

  static yupSchema() {
    return yup.object({
        type: (yup.string() as any).enum(CriminalHistoryType).required().nullable(),
        max_count: yup.number().required().nullable(),
        max_years: yup.number().required().nullable(),
    });
  }
}

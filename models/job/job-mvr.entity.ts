import { MvrType } from '../../enums/users/mvr-type.enum';
import * as yup from "yup";

export class JobMvrEntity {
  type?: MvrType;
  max_count?: number;
  max_years?: number;

  static yupSchema() {
    return yup.object({
        type: (yup.string() as any).enum(MvrType).required().nullable(),
        max_count: yup.number().required().nullable(),
        max_years: yup.number().required().nullable(),
    });
  }
}

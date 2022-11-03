import * as yup from "yup";
import { AccidentHistoryEntity } from "./accident-last-5-years/index.dto";

export class AccidentLastFiveYearsDto {
  accidents_within_last_5_years: number;
  accident_detail?: AccidentHistoryEntity[] = [];

  static yupSchema() {
    return yup.object({
      accidents_within_last_5_years: yup.number().nullable(),
    });
  }
}

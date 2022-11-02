import * as yup from "yup";

export class ViolationHistoryDto {
  violations_last_3_years: string;
  date_of_violation_1: string;
  location_1: string;
  charge_1: string;
  penalty_1: string;
  date_of_violation_2: string;
  location_2: string;
  charge_2: string;
  penalty_2: string;
  date_of_violation_3: string;
  location_3: string;
  charge_3: string;
  penalty_3: string;

  static yupSchema() {
    return yup.object({
      violations_last_3_years: yup.string().nullable(),
      date_of_violation_1: yup.string().nullable(),
      location_1: yup.string().nullable(),
      charge_1: yup.string().nullable(),
      penalty_1: yup.string().nullable(),
      date_of_violation_2: yup.string().nullable(),
      location_2: yup.string().nullable(),
      charge_2: yup.string().nullable(),
      penalty_2: yup.string().nullable(),
      date_of_violation_3: yup.string().nullable(),
      location_3: yup.string().nullable(),
      charge_3: yup.string().nullable(),
      penalty_3: yup.string().nullable(),
    });
  }
}

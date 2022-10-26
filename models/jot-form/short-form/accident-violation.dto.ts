import * as yup from "yup";

export class AcciedentViolationDto {
  can_pass_drug_test: boolean = false;
  accidents_last_5_years: number;
  voilations_in_last_3_years: number;

  static yupSchema() {
    return yup.object({
      can_pass_drug_test: yup.boolean().nullable(),
      accidents_last_5_years: yup.number().required().nullable(),
      voilations_in_last_3_years: yup.number().required().nullable(),
    });
  }
}

import * as yup from "yup";

export class AcciedentViolationDto {
  can_pass_drug_test: boolean = false;
  accident_count: number;
  moving_violations_count: number;

  static yupSchema() {
    return yup.object({
      can_pass_drug_test: yup.boolean().nullable(),
      accident_count: yup.number().required().nullable(),
      moving_violations_count: yup.number().required().nullable(),
    });
  }
}

import * as yup from "yup";

export class AccidentViolationDto {
  can_pass_drug_test: boolean = false;
  accident_count: number;
  moving_violations_count: number;
  all_violations_count: number;
  // ELIGIBLE_TO_WORK_IN_US: string;
  authorized_to_work_in_us?: boolean = true;


  static yupSchema() {
    return yup.object({
      can_pass_drug_test: yup.boolean().nullable(),
      accident_count: yup.number().required().nullable(),
      moving_violations_count: yup.number().required().nullable(),
      all_violations_count: yup.number().required().nullable(),
      // ELIGIBLE_TO_WORK_IN_US: yup.string().required().nullable(),
      authorized_to_work_in_us: yup.bool().nullable(),
    });
  }
}
